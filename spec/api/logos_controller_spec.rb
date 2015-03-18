require "spec_helper"

describe "/api/logos", :type => :api do

	def valid_attributes
		FactoryGirl.attributes_for(:logo)
	end

	before do
		@band = FactoryGirl.create(:band)
	end

	describe "CREATE Logo" do
    let(:url) {"/api/logos"}

		context "with valid attributes" do

	    
		  it "should be successful" do
		    post( "#{url}.json",
		     :logo => valid_attributes.merge({:band_id => @band._id}) )

		    created_logo = Logo.where(:band_id => @band.id).last

		    route = "/api/logos/#{created_logo.id}" 

		    last_response.status.should eql(201)
		    last_response.headers["Location"].should eql(route)
		    last_response.body.should eql(created_logo.to_json)
		  end
	  end

	  context "with invalid attributes" do
	  	it "should not be successful" do
				post( "#{url}.json",
		     :logo => valid_attributes)

		    last_response.status.should eql(422)

	  	end
	  end
  end

  describe "DELETE a Logo" do
    
  	before do
  		@logo = FactoryGirl.create(:logo, :band_id => @band.id)
  	end

    let(:url) {"/api/logos/#{@logo.id}"}

  	it "should be successful" do
  		delete "#{url}.json"

  		last_response.status.should == 204
  	end
  end

  describe "UPDATE a Logo" do
    
  	before do
  		@logo = FactoryGirl.create(:logo, :band_id => @band.id)
  	end

    let(:url) {"/api/logos/#{@logo.id}"}

  	it "should be successful" do
  		put "#{url}.json", :logo => {
  			:font_name => "Times New Roman"}

  		last_response.status.should == 204
  		last_response.body.should eql("")

  		@logo.reload
  		@logo.font_name.should eql("Times New Roman")
  	end
  end

end