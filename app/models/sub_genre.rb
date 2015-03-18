class SubGenre
  include Mongoid::Document

  belongs_to :genre

  has_many :bands
  
  field :name, type: String

end