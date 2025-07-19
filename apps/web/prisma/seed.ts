import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

const ALPHA_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const NUMERIC_SIZES = Array.from({ length: 10 }, (_, i) => [
  `${36 + i}`,
  `${36 + i}.5`,
]).flat();
const LOCATIONS = ['US', 'VN'];

async function main() {
  console.log("🧼 Clearing existing data...");
  await prisma.variantSize.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.size.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.model.deleteMany();
  await prisma.modelBase.deleteMany();
  await prisma.collaboration.deleteMany();

  console.log("📦 Seeding sizes...");
  for (const loc of LOCATIONS) {
    for (const label of ALPHA_SIZES) {
      await prisma.size.create({
        data: { label, system: 'alpha', location: loc },
      });
    }
    for (const label of NUMERIC_SIZES) {
      await prisma.size.create({
        data: { label, system: 'numeric', location: loc },
      });
    }
  }

  await prisma.size.create({
    data: { label: 'One Size', system: 'one_size', location: 'GLOBAL' },
  });

  const sizes = await prisma.size.findMany();
  console.log(`✅ Done seeding sizes: ${sizes.length} entries.`);

  console.log("🏷️ Seeding tags...");
  const tagSlugs = [
    'new_arrivals', 'best_sellers', 'prime_delivery', 'liberty_london_florals',
    'fast_delivery', 'soft_lux', 'must_have', 'summer_savings', 'trending_now',
    'disney_collection', 'premium_collaborations', 'release_dates', 'track_pants',
  ];
  for (const slug of tagSlugs) {
    await prisma.tag.create({
      data: { slug, name: faker.word.words(2) },
    });
  }

  console.log("📚 Seeding model bases (collections)...");
  const modelBaseSlugs = [
    'adicolor', 'gazelle', 'samba', 'superstar', 'sportswear', 'supernova', 'terrex',
    'ultraboost', 'y-3', 'zne', 'stella_mccartney', 'originals', 'f50',
    'adizero', '4d', 'five_ten', 'tiro', 'copa',
  ];
  for (const slug of modelBaseSlugs) {
    await prisma.modelBase.create({
      data: { slug, name: slug.replace(/_/g, ' ').toUpperCase() },
    });
  }

  console.log("🤝 Seeding collaborations...");
  const collabs = [
    'Bad Bunny', 'Bape', 'Disney', 'Edison Chen', 'Fear of God Athletics',
    'Pharrell', 'Prada', 'Sporty & Rich', 'Wales Bonner',
  ];
  for (const name of collabs) {
    await prisma.collaboration.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }

  console.log("👟 Generating sample products...");
  const brands = ['Adidas', 'Originals', 'Athletics', 'Essentials'];
  const sports = ['Running', 'Soccer', 'Basketball', 'Tennis', 'Gym', 'Training', 'Golf', 'Hiking', 'Yoga', 'Football', 'Baseball'];
  const productTypes = ['Sneakers', 'Cleats', 'Sandals', 'Hoodie', 'Pants', 'Shorts', 'Jacket', 'Jersey', 'TShirt', 'TankTop', 'Dress', 'Leggings', 'Tracksuit', 'Bra', 'Coat'];
  const genders = ['Men', 'Women', 'Unisex', 'Kids'];
  const categories = ['Shoes', 'Apparel', 'Accessories'];

  for (let i = 0; i < 95; i++) {
    const brand = faker.helpers.arrayElement(brands);
    const producttype = faker.helpers.arrayElement(productTypes);
    const gender = faker.helpers.arrayElement(genders);
    const category = faker.helpers.arrayElement(categories);
    const sport = faker.helpers.arrayElement(sports);
    const modelNumber = `MOD${i.toString().padStart(4, '0')}`;
    const name = `${brand} ${producttype} ${i + 1}`;

    const modelBase = await prisma.modelBase.findFirst({ orderBy: { id: 'asc' } });
    const model = await prisma.model.create({
      data: {
        name: `${brand} ${producttype} Model ${i + 1}`,
        modelBaseId: modelBase?.id!,
      },
    });

    const tagIds = await prisma.tag.findMany({ take: 2 });
    const collab = await prisma.collaboration.findFirst();

    const product = await prisma.product.create({
      data: {
        name,
        modelNumber,
        gender,
        franchise: 'Tubular',
        productType: producttype,
        brand,
        category,
        sport,
        modelBaseId: modelBase?.id!,
        modelId: model.id,
        collaborationId: collab?.id!,
        descriptionH5: `${producttype} for ${sport} by ${brand}`,
        descriptionP: "Performance-driven product for the modern athlete.",
        care: "Machine wash cold. Tumble dry low.",
        specifications: "Ergonomic, high-performance, breathable, eco-friendly",
        tags: {
          connect: tagIds.map((t) => ({ id: t.id })),
        },
      },
    });

    const colors = ['Black', 'White', 'Red', 'Blue'];
    for (const color of colors) {
      const variant = await prisma.variant.create({
        data: {
          productId: product.id,
          color,
          price: +faker.commerce.price({ min: 40, max: 150 }),
          compareAtPrice: +faker.commerce.price({ min: 160, max: 250 }),
          variantCode: `VC${i + 1}-${color.slice(0, 2).toUpperCase()}-${faker.string.alphanumeric(4).toUpperCase()}`,
          stock: faker.number.int({ min: 5, max: 30 }),
        },
      });

      let sizes: any[] = [];
      if (category === 'Shoes') {
        sizes = await prisma.size.findMany({ where: { system: 'numeric', location: 'US' } });
      } else if (category === 'Apparel') {
        sizes = await prisma.size.findMany({ where: { system: 'alpha', location: 'US' } });
      } else {
        sizes = await prisma.size.findMany({ where: { label: 'One Size', location: 'GLOBAL' } });
      }

      for (const size of sizes) {
        await prisma.variantSize.create({
          data: {
            variantId: variant.id,
            sizeId: size.id,
            stock: faker.number.int({ min: 1, max: 30 }),
          },
        });
      }
    }

    console.log(`✅ Created product ${i + 1}: ${product.name}`);
  }

  console.log("🎉 Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
