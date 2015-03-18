require "spec_helper"

describe "/api/songs", :type => :api do

	def valid_attributes
		FactoryGirl.attributes_for(:song)
	end

	before do
		@band = FactoryGirl.create(:band)
		@album = FactoryGirl.create(:album, :band_id => @band.id)
	end

	describe "SHOW Song" do
		before do
  		@song = FactoryGirl.create(:song, :album_id => @album._id)
  	end

    let(:url) {"/api/songs/#{@song.id}"}

  	it "should be successful" do
  		get "#{url}.json"

  		last_response.status.should == 200
  		last_response.body.should_not eql("")

  	end
	end

	describe "CREATE Song" do
    let(:url) {"/api/songs"}

		context "with valid attributes" do
	    
		  it "should be successful" do
		    post( "#{url}.json",
		     :song => valid_attributes.merge({:album_id => @album._id}) )

		    created_song = Song.where(:album_id => @album._id).last

		    route = "/api/songs/#{created_song.id}" 

		    last_response.status.should eql(201)
		    last_response.headers["Location"].should eql(route)
		    last_response.body.should eql(created_song.to_json)
		  end

		  it "should assign the Song a track number" do
				post( "#{url}.json",
		     :song => valid_attributes.merge({:album_id => @album._id}) )

		    created_song = Song.where(:album_id => @album._id).last
				created_song.track_no.should_not be_nil		  	
		  end
	  end

	  context "with invalid attributes" do
	  	it "should not be successful" do
				post( "#{url}.json",
		     :song => valid_attributes)

		    last_response.status.should eql(422)

	  	end
	  end
  end

  describe "DELETE a Song" do
    
  	before do
  		@song = FactoryGirl.create(:song, :album_id => @album._id)
  	end

    let(:url) {"/api/songs/#{@song.id}"}

  	it "should be successful" do
  		delete "#{url}.json"

  		last_response.status.should == 204
  	end
  end

  describe "UPDATE a Song" do
    
  	before do
  		@song = FactoryGirl.create(:song, :album_id => @album._id)
  	end

    let(:url) {"/api/songs/#{@song.id}"}

  	it "should be successful" do
  		put "#{url}.json", :song => {
  			:lyrics => "Hello Hello"}

  		last_response.status.should == 204
  		last_response.body.should eql("")

  		@song.reload
  		@song.lyrics.should eql("Hello Hello")
  	end
  end

end