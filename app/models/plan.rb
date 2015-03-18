class Plan
  include Mongoid::Document
  
  field :name, type: String
  field :price, type: Integer
  field :album_count, type: Integer
  field :song_count, type: Integer

  has_many :users
end