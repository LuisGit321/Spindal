class Api::CreditCardsController < ApplicationController
	respond_to :json

	def update
    credit_card = CreditCard.find(params[:id])

    if credit_card.update_attributes(params[:credit_card])
			respond_with(credit_card, :location => api_credit_card_path(credit_card), api: true)
		else
			respond_with(credit_card, api: true)
		end
	end

end