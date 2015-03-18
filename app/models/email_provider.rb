class EmailProvider
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :bands
  
  field :name
  
end
