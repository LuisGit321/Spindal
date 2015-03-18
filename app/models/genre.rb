class Genre
  include Mongoid::Document

  has_many :sub_genres
  has_many :bands
  
  field :name, type: String
end