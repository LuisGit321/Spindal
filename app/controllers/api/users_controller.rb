class Api::UsersController < ApplicationController
	respond_to :json

	def update
    user = User.find(params[:id])

    user.first_name = params[:user][:first_name] unless params[:user][:first_name].blank?
    user.last_name = params[:user][:last_name] unless params[:user][:last_name].blank?
    #user.email = params[:user][:email]
    #user.password = params[:user][:password]

    user.plan_id = params[:user][:plan_id] unless params[:user][:plan_id].blank?
    user.status = params[:user][:status] unless params[:user][:status].blank?

    if user.save
			respond_with(user, :location => api_user_path(user), api: true)
		else
			respond_with(user, api: true)
		end
	end

end