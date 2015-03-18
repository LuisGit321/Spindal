require "spec_helper"

describe "/api/credit_cards", :type => :api do

  def valid_attributes
    FactoryGirl.attributes_for(:credit_card)
  end

  before(:all) do
    @credit_card = FactoryGirl.create(:credit_card)
  end

  after(:all) do
    @credit_card.destroy
  end
  
  describe "UPDATE a Credit Card" do
    let(:url) {"/api/credit_cards/#{@credit_card.id}"}

    it "should be successful" do
      put "#{url}.json", :credit_card => {
        :number => 1234567891234567}

      last_response.status.should == 204
      last_response.body.should eql("")

      @credit_card.reload
      @credit_card.number.should eql("1234567891234567")
    end
  end

end