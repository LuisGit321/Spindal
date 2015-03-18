class Album
  include Mongoid::Document
  include Mongoid::Timestamps

  attr_protected :cover_image
  
  belongs_to :band
  has_many :songs, order: [:track_no, :asc]
  has_many :purchases, :as => :buyable

  validates :band, :presence => true

  field :title
  field :cover_image
  field :record_label
  field :release_year, type: Integer
  field :download_type
  field :price, type: Float
  field :amazon_store_link
  field :itunes_store_link

  field :title_disabled, type: Boolean
  field :visibility_disabled, type: Boolean
  field :download_disabled, type: Boolean
  field :share_disabled, type: Boolean
  field :num_song_plays_disabled, type: Boolean
  field :parental_advisory_disabled, type: Boolean
  field :release_date_disabled, type: Boolean
  field :record_label_disabled, type: Boolean

  mount_uploader :cover_image, AlbumCoverUploader

  # def as_json(options = {})
  #   options.merge
  # end
end
