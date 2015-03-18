class HomeController < ApplicationController

	def login
		@user = User.includes(:band => [:live_shows, :logo, :videos, :albums, :blog_platform, :genre, :sub_genre], :credit_card => {}).first
		
		sign_in_and_redirect @user, :event => :authentication
	end

	def logout
		sign_out(current_user)
		redirect_to root_path
	end

end