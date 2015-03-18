class Song
  include Mongoid::Document
  include Mongoid::Timestamps

  attr_protected :file

  # - Associations - #
  belongs_to :album
  embeds_many :song_encodings
  has_many :purchases, :as => :buyable
  has_many :photos, :as => :imageable  

  # - Validations - #
  validates_presence_of :album

  # - Callbacks - #
  before_create :set_track_no, :set_opening_song

  # - Fields - #
  field :track_no, type: Integer
  field :title
  field :lyrics

  field :download_type
  field :price, type: Float

  field :file
  field :amazon_store_link
  field :itunes_store_link

  field :slideshow_trans_time
  field :slideshow_trans_style
  field :video_embed_tag

  field :opening_song, type: Boolean, default: false

  field :disabled, type: Boolean
  field :download_disabled, type: Boolean
  field :lyrics_disabled, type: Boolean
  field :fullscreen_disabled, type: Boolean

  # {
  #   job_id: integer,
  #   state: {pending, waiting, processing, finished, failed, and cancelled}
  # }
  field :encoding_details, type: Hash

  delegate :band, to: :album

  # - Scopes - #
  scope :requires_encoding, where("encoding_details.state" => { "$in" => %w(pending waiting processing) })

  # - CarrierWave - #
  mount_uploader :file, SongUploader

  def set_track_no
    current_track = album.songs.max(:track_no)
    self.track_no = current_track.nil?? 1 : current_track + 1
  end

  def set_opening_song
    self.opening_song = true unless band.has_song?
  end

  def initialize_song_encodings_from_zencoder(output_media_files)
    song_encodings.destroy_all
    output_media_files.each do |omf|
      song_encodings.new(zencoder_attributes: omf)
    end
  end

  # Too few arguments error if we include embedded documents.
  # ...not that they have any useful data available for them...
  def as_json(options = {})
    opts = options.merge(except: :song_encodings, includes: :encoding_details)
    super(opts)
  end
end
