require "ostruct"

class Api::SessionsController < Api::ApiController
  before_action :authenticate!, except: %i[create refresh revoke]

  def index
    @current_user = current_user if current_user
    @current_user_token = current_user_token if current_user_token
  end

  def create
    payload = proxy_auth(:post, "/api/login", { session: session_params.to_h })
    return if performed?

    @user = session_user_from(payload)
  end

  def destroy
    proxy_auth(:delete, "/api/logout")
    return if performed?

    response200
  end

  def refresh
    payload = proxy_auth(:post, "/api/refresh", { auth: { refresh_token: refresh_token_param } })
    return if performed?

    @user = session_user_from(payload)
  end

  def revoke
    proxy_auth(:post, "/api/revoke", { auth: { refresh_token: refresh_token_param } })
    return if performed?

    response200
  end

  private

  def session_params
    params.require(:session).permit(:email, :password, :remember_me)
  end

  def refresh_token_param
    params.dig(:auth, :refresh_token).presence || params[:refresh_token]
  end

  def auth_service_url
    ENV.fetch("AUTH_SERVICE_URL", "http://localhost:9000")
  end

  def proxy_auth(method, path, body = nil)
    response = Faraday.public_send(method, "#{auth_service_url}#{path}") do |req|
      req.headers["Authorization"] = request.headers["Authorization"] if request.headers["Authorization"].present?
      req.headers["Content-Type"] = "application/json"
      req.headers["Accept"] = "application/json"
      req.body = body.to_json if body.present?
    end

    unless response.success?
      begin
        render json: JSON.parse(response.body), status: response.status
      rescue JSON::ParserError
        response401_with_error(error_message(:not_logged_in))
      end
      return
    end

    return {} if response.body.blank?

    JSON.parse(response.body)
  rescue Faraday::Error => e
    Rails.logger.error("Auth Service error: #{e.message}")
    response401_with_error(error_message(:not_logged_in))
    nil
  end

  def session_user_from(payload)
    return if payload.blank?

    user = payload["user"] || {}
    tokens = payload["tokens"] || {}
    OpenStruct.new(
      id: user["id"],
      email: user["email"],
      name: user["name"],
      admin: user["admin"] || user["role"],
      password_digest: user["passwordHash"] || user["password_digest"],
      token: tokens.dig("access", "token") || payload["token"] || user["token"],
      token_expiration_at: tokens.dig("access", "expires"),
      refresh_token: tokens.dig("refresh", "token") || payload["refresh_token"] || payload.dig("refresh", "access", "token"),
      refresh_token_expiration_at: tokens.dig("refresh", "expires") || payload.dig("refresh", "access", "expires")
    )
  end
end
