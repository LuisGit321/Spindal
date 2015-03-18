require "spec_helper"

describe "/api/bands", :type => :api do

  def valid_attributes
    FactoryGirl.attributes_for(:band)
  end

  before(:all) do
    @band = FactoryGirl.create(:band)
    FactoryGirl.create(:live_show, :band_id => @band.id)
  end

  after(:all) do
    @band.destroy
  end

  describe "Fetch a Band" do

    let(:url) {"/api/bands/#{@band.id}"}
    
    it "should retrieve band successfully" do
      get "#{url}.json"
      get "#{url}.json"

      last_response.status.should eql(200)
    end

    it "should retrieve Live Shows for the band" do
      get "#{url}.json"
      band_response = JSON.parse(last_response.body)

      band_response["live_shows"].should_not be_empty
    end
  end

  describe "UPDATE a Band" do
    let(:url) {"/api/bands/#{@band.id}"}

    it "should be successful" do
      put "#{url}.json", :band => {
        :name => "New Band"}

      last_response.status.should == 204
      last_response.body.should eql("")

      @band.reload
      @band.name.should eql("New Band")
    end
  end

end