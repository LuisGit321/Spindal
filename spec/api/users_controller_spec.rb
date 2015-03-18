require "spec_helper"

describe "/api/users", :type => :api do

  def valid_attributes
    FactoryGirl.attributes_for(:user)
  end

  before(:all) do
    @user = FactoryGirl.create(:user)
  end

  after(:all) do
    @user.destroy
  end
  
  describe "UPDATE a User" do
    let(:url) {"/api/users/#{@user.id}"}

    it "should be successful" do
      put "#{url}.json", :user => {
        :first_name => "New User"}

      last_response.status.should == 204
      last_response.body.should eql("")

      @user.reload
      @user.first_name.should eql("New User")
    end
  end

end