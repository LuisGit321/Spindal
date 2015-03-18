module BandsHelper
	def app_data
		@data = {}
		 # TODO: remove extra fields from response
		@data[:band_genre] = Genre.all.only(:_id, :name)
		@data[:band_sub_genre] = SubGenre.all.only(:_id, :name, :genre_id)
		@data[:blog_platform] = BlogPlatform.all.only(:_id, :name)
    @data[:email_provider] = EmailProvider.all.only(:_id, :name)
		@data[:plan] = Plan.all

		@data
	end
end