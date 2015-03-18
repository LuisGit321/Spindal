require "spec_helper"

describe "/api/albums", :type => :api do

	def valid_attributes
		FactoryGirl.attributes_for(:album)
	end

	before do
		@band = FactoryGirl.create(:band)
	end

	describe "CREATE Album" do
    let(:url) {"/api/albums"}

		context "with valid attributes" do
	    
		  it "should be successful" do
		    post( "#{url}.json",
		     :album => valid_attributes.merge({:band_id => @band._id}) )

		    created_album = Album.where(:band_id => @band.id).last

		    route = "/api/albums/#{created_album.id}" 

		    last_response.status.should eql(201)
		    last_response.headers["Location"].should eql(route)
		    last_response.body.should eql(created_album.to_json)
		  end
	  end

	  context "with invalid attributes" do
	  	it "should not be successful" do
				post( "#{url}.json",
		     :album => valid_attributes)

		    last_response.status.should eql(422)

	  	end
	  end
  end

  describe "DELETE a Album" do
    
  	before do
  		@album = FactoryGirl.create(:album, :band_id => @band.id)
  	end

    let(:url) {"/api/albums/#{@album.id}"}

  	it "should be successful" do
  		delete "#{url}.json"

  		last_response.status.should == 204
  	end
  end

  describe "UPDATE a Album" do
    
  	before do
  		@album = FactoryGirl.create(:album, :band_id => @band.id)
  	end

    let(:url) {"/api/albums/#{@album.id}"}

  	it "should be successful" do
  		put "#{url}.json", :album => {
  			:title => "Times of Rock"}

  		last_response.status.should == 204
  		last_response.body.should eql("")

  		@album.reload
  		@album.title.should eql("Times of Rock")
  	end
  end

end