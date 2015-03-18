class UploadsController < ApplicationController
  layout 'uploads'
  skip_before_filter :protect_from_forgery

  def new
    @uploader = ImageUploader.new
    @uploader.success_action_redirect = uploads_url
  end
end
