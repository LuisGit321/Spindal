class AppConstantsController < ApplicationController
	respond_to :json

	def index
		@data = {}
		 # TODO: remove extra fields from response
		@data[:band_genre] = Genre.all.only(:_id, :name)
		@data[:band_sub_genre] = SubGenre.all.only(:_id, :genre_id, :name)
		@data[:blog_platform] = BlogPlatform.all.only(:_id, :name)
		@data[:email_provider] = EmailProvider.all.only(:_id, :name)

		respond_with @data
	end
end