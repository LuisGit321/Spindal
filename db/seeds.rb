# -*- coding: utf-8 -*-

['Alternative', 'Anime', 'Blues', 'Brazilian', 'Christian & Gospel', 'Classical', 'Easy Listening', 'Electronic', 'Hip Hop/Rap', 'Holiday', 'Instrumental', 'Jazz', 'R&B/Soul', 'Reggae', 'Rock', 'Soundtrack', 'Spoken Word', 'Vocal', 'Orchestral', 'Comedy', 'Country', 'Dance', 'Smooth Jazz', 'Latino', 'New Age', 'Opera', 'Pop', 'World'].each do |genre_name|
  FactoryGirl.create(:genre, :name => genre_name)
end

['College Rock', 'Goth Rock', 'Grunge', 'Indie Rock', 'New Wave', 'Punk'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Alternative').first,
                     :name => sub_genre_name)
end

['Acoustic Blues', 'Chicago Blues', 'Classic Blues', 'Contemporary Blues', 'Country Blues', 'Delta Blues', 'Electric Blues'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Blues').first,
                     :name => sub_genre_name)
end

["Axé", 'Baile Funk', 'Bossa Nova', 'Choro', 'Forró', 'Frevo', 'MPB', 'Pagode', 'Samba', 'Sertanejo'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Brazilian').first,
                     :name => sub_genre_name)
end

['CCM', 'Christian Metal', 'Christian Pop', 'Christian Rap', 'Christian Rock', 'Classic Christian', 'Contemporary Gospel', 'Gospel', 'Praise & Worship', 'Southern Gospel', 'Traditional Gospel'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Christian & Gospel').first,
                     :name => sub_genre_name)
end

['Avant-Garde', 'Baroque', 'Chamber Music', 'Chant', 'Choral', 'Classical Crossover', 'Early Music', 'High Classical', 'Impressionist', 'Medieval', 'Minimalism', 'Modern Composition', 'Opera'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Classical').first,
                     :name => sub_genre_name)
end

['Bop', 'Lounge', 'Swing'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Easy Listening').first,
                     :name => sub_genre_name)
end

['Ambient', 'Downtempo', 'Electronica', 'IDM/Experimental', 'Industrial'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Electronic').first,
                     :name => sub_genre_name)
end

['Alternative Rap', 'Dirty South', 'East Coast Rap', 'Gangsta Rap', 'Hardcore Rap', 'Hip-Hop', 'Latin Rap', 'Old School Rap', 'Rap', 'Underground Rap', 'West Coast Rap'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Hip Hop/Rap').first,
                     :name => sub_genre_name)
end

['Chanukah', 'Christmas', "Christmas: Children's", 'Christmas: Classic', 'Christmas: Classical', 'Christmas: Jazz', 'Christmas: Modern', 'Christmas: Pop', 'Christmas: R&B', 'Christmas: Religious', 'Christmas: Rock', 'Easter', 'Holiday: Other'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Holiday').first,
                     :name => sub_genre_name)
end

['Avant-Garde Jazz', 'Big Band', 'Contemporary Jazz', 'Cool', 'Crossover Jazz', 'Dixieland', 'Fusion', 'Hard Bop', 'Latin Jazz', 'Mainstream Jazz', 'Ragtime'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Jazz').first,
                     :name => sub_genre_name)
end

['Contemporary R&B', 'Disco', 'Doo Wop', 'Funk', 'Motown', 'Neo-Soul', 'Quiet Storm', 'Soul'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'R&B/Soul').first,
                     :name => sub_genre_name)
end

['Dancehall', 'Dub', 'Roots Reggae', 'Ska'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Reggae').first,
                     :name => sub_genre_name)
end

['Adult Alternative', 'American Trad Rock', 'Arena Rock', 'Blues-Rock', 'British Invasion', 'Death Metal/Black Metal', 'Glam Rock', 'Hair Metal', 'Hard Rock', 'Metal', 'Jam Bands', 'Prog-Rock/Art Rock', 'Psychedelic', 'Rock & Roll', 'Rockabilly', 'Roots Rock', 'Singer/Songwriter', 'Southern Rock, Surf', 'Tex-Mex', 'Singer/Songwriter', 'Alternative Folk', 'Contemporary Folk', 'Contemporary Singer/Songwriter', 'Folk-Rock', 'New Acoustic', 'Traditional Folk'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Rock').first,
                     :name => sub_genre_name)
end

['Foreign Cinema', 'Musicals', 'Original Score', 'Soundtrack', 'TV Soundtrack'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Soundtrack').first,
                     :name => sub_genre_name)
end

['Standards', 'Traditional Pop', 'Vocal Jazz'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Vocal').first,
                     :name => sub_genre_name)
end

['Renaissance', 'Romantic', 'Wedding Music'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Orchestral').first,
                     :name => sub_genre_name)
end

['Novelty', 'Standup Comedy'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Comedy').first,
                     :name => sub_genre_name)
end

['Alternative Country', 'Americana', 'Bluegrass', 'Contemporary Bluegrass', 'Contemporary Country', 'Country Gospel', 'Honky Tonk', 'Outlaw Country', 'Traditional Bluegrass', 'Traditional Country', 'Urban Cowboy'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Country').first,
                     :name => sub_genre_name)
end

['Breakbeat', 'Exercise', 'Garage', 'Hardcore', 'House', "Jungle/Drum'n'bass", 'Techno', 'Trance'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Dance').first,
                     :name => sub_genre_name)
end

['Trad Jazz'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Smooth Jazz').first,
                     :name => sub_genre_name)
end

['Alternativo & Rock Latino', 'Baladas y Boleros', 'Contemporary Latin', 'Latin Jazz', 'Pop Latino', 'Raíces', 'Reggaeton y Hip-Hop', 'Regional Mexicano', 'Salsa y Tropical'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Latino').first,
                     :name => sub_genre_name)
end

['Environmental', 'Healing', 'Meditation', 'Nature', 'Relaxation', 'Travel'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'New Age').first,
                     :name => sub_genre_name)
end

['Adult Contemporary', 'Britpop', 'Pop/Rock', 'Soft Rock', 'Teen Pop', 'Vocal Pop'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'Pop').first,
                     :name => sub_genre_name)
end

['Africa', 'Afro-Beat', 'Afro-Pop', 'Asia', 'Australia', 'Cajun', 'Caribbean', 'Celtic', 'Celtic Folk', 'Contemporary Celtic', 'Drinking Songs', 'Europe', 'France', 'Hawaii', 'Indian Pop', 'Japan', 'Japanese Pop', 'Klezmer', 'Middle East', 'North America', 'Polka', 'South Africa', 'South America', 'Traditional Celtic', 'Worldbeat', 'Zydeco'].each do |sub_genre_name|
  FactoryGirl.create(:sub_genre,
                     :genre => Genre.where(:name => 'World').first,
                     :name => sub_genre_name)
end

["MailChimp","Constant Contact"].each do |email_provider|
  FactoryGirl.create(:email_provider, :name => email_provider)
end

["Blogger","Tumblr"].each do |blog_name|
  FactoryGirl.create(:blog_platform, :name => blog_name)
end

[
  {:name => "silver", :price => 8, :album_count => 1, :song_count => 15},
  {:name => "gold", :price => 14, :album_count => 3, :song_count => 15},
  {:name => "platinum", :price => 24, :album_count => -1, :song_count => -1}
].each do |plan|
  FactoryGirl.create(:plan, plan)
end


user = FactoryGirl.create(:user,
  :plan => Plan.first)

FactoryGirl.create(:credit_card, :user => user)

band = FactoryGirl.create(:band, 
  :user => user,
  :genre => Genre.first,
  :sub_genre => SubGenre.first,
  :blog_platform => BlogPlatform.first,
  :email_provider => EmailProvider.first)

FactoryGirl.create(:logo, band: band)

6.times do 
  FactoryGirl.create(:live_show, band: band)
end

3.times do
  album = FactoryGirl.create(:album, band: band)
  10.times { |n| FactoryGirl.create(:song, album: album, track_no: n+1) }
end