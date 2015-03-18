class Video
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :band
  validates :band, :presence => true

  field :vid_id, type: String
  field :title, type: String
  field :url, type: String
  field :img_url, type: String
  field :provider, type: String
  field :order, type: Integer

end