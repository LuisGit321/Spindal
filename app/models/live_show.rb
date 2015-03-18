class LiveShow
  include Mongoid::Document
  include Mongoid::Timestamps
  
  belongs_to :band

  field :day, type: Date
  field :venue, type: String
  field :city, type: String
  field :state, type: String
  field :ticket_url, type: String
  field :tickets_disabled, type: Boolean
  validates :band, :presence => true
end