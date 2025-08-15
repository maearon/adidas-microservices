import os
import json
import django
import time
import pika
import redis

from django.core.management.base import BaseCommand
from elasticsearch import Elasticsearch

def connect_elasticsearch_with_retry(url, retries=10, delay=30):
    for attempt in range(retries):
        try:
            es = Elasticsearch([url])
            if es.ping():
                print("[✔] Connected to Elasticsearch")
                return es
            else:
                print(f"[!] Ping failed (attempt {attempt+1})")
        except Exception as e:
            print(f"[!] Attempt {attempt+1} failed: {e}")
        time.sleep(delay)
    raise Exception("❌ Failed to connect to Elasticsearch after retries")

# Init clients
ES_URL = os.getenv("ELASTICSEARCH_URL", "http://elasticsearch:9200")
es = connect_elasticsearch_with_retry(ES_URL)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Redis client
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"), decode_responses=True)

def create_index_if_not_exists():
    index_name = "products"
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body={
            "mappings": {
                "properties": {
                    "name":        { "type": "text" },
                    "price":       { "type": "float" },
                    "brand":       { "type": "text" },
                    "category":    { "type": "keyword" },
                    "suggest":     { "type": "completion" },
                    "model_number":    { "type": "keyword" },
                    "gender":      { "type": "keyword" },
                    "franchise":   { "type": "keyword" },
                    "producttype": { "type": "keyword" },
                    "sport":       { "type": "keyword" },
                    "description_h5": { "type": "text" },
                    "description_p":  { "type": "text" },
                    "specifications": { "type": "object" },
                    "care":           { "type": "text" },
                    "created_at":     { "type": "date" },
                    "updated_at":     { "type": "date" }
                }
            }
        })

    if not es.indices.exists(index="variants"):
        es.indices.create(index="variants", body={
            "mappings": {
                "properties": {
                    "product_id":     { "type": "keyword" },
                    "color":          { "type": "keyword" },
                    "sku":            { "type": "keyword" },
                    "price":          { "type": "float" },
                    "originalprice":  { "type": "float" },
                    "stock":          { "type": "integer" },
                    "created_at":     { "type": "date" },
                    "updated_at":     { "type": "date" }
                }
            }
        })

def index_product_and_variants(data):
    product_id = data["id"]
    redis_client.set(f"product:{product_id}", json.dumps(data))  # store in Redis

    # Index product
    product_doc = {
        "name":           data.get("name", ""),
        "model_number":       data.get("model_number", ""),
        "gender":         data.get("gender", ""),
        "franchise":      data.get("franchise", ""),
        "producttype":    data.get("producttype", ""),
        "brand":          data.get("brand", ""),
        "category":       data.get("category", ""),
        "sport":          data.get("sport", ""),
        "description_h5": data.get("description_h5"),
        "description_p":  data.get("description_p"),
        "specifications": data.get("specifications"),
        "care":           data.get("care"),
        "created_at":     data.get("created_at"),
        "updated_at":     data.get("updated_at"),
        "suggest": {
            "input": [data.get("name", "")],
            "weight": 1
        }
    }

    es.index(index="products", id=product_id, body=product_doc)
    print(f"[✔] Indexed product #{product_id}")

    # Index variants
    variants = data.get("variants", [])
    for variant in variants:
        variant_id = variant.get("id")
        variant_doc = {
            "product_id":    product_id,
            "color":         variant.get("color"),
            "sku":           variant.get("sku"),
            "price":         variant.get("price"),
            "originalprice": variant.get("originalprice"),
            "stock":         variant.get("stock"),
            "created_at":    variant.get("created_at"),
            "updated_at":    variant.get("updated_at"),
        }

        es.index(index="variants", id=variant_id, body=variant_doc)
        redis_client.set(f"variant:{variant_id}", json.dumps(variant_doc))
        print(f"[✔] Indexed variant #{variant_id} of product #{product_id}")

def handle_event(body):
    try:
        event = json.loads(body)
        if event["event"] == "product.created":
            index_product_and_variants(event["data"])
        else:
            print(f"[~] Ignored event: {event['event']}")
    except Exception as e:
        print(f"[!] Error: {e}")

def connect_rabbitmq_with_retry(host, retries=5, delay=5):
    for attempt in range(retries):
        try:
            print(f"[>] Attempt {attempt + 1}: Connecting to RabbitMQ at {host}...")
            return pika.BlockingConnection(pika.ConnectionParameters(host=host))
        except pika.exceptions.AMQPConnectionError as e:
            print(f"[!] Connection failed: {e}")
            time.sleep(delay)
    raise Exception("❌ Failed to connect to RabbitMQ after retries.")

class Command(BaseCommand):
    help = "Consume product.created events from RabbitMQ and index into Elasticsearch"

    def handle(self, *args, **kwargs):
        create_index_if_not_exists()

        rabbitmq_host = os.getenv("RABBITMQ_HOST", "localhost")
        connection = connect_rabbitmq_with_retry(rabbitmq_host, retries=20, delay=3)
        channel = connection.channel()

        channel.exchange_declare(exchange="product_events", exchange_type="topic", durable=True)
        result = channel.queue_declare('', exclusive=True)
        queue_name = result.method.queue

        channel.queue_bind(exchange="product_events", queue=queue_name, routing_key="product.created")

        print("[*] Waiting for product.created events...")

        def callback(ch, method, properties, body):
            handle_event(body)

        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
