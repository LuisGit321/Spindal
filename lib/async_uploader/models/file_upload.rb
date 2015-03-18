class FileUpload
  # - Constants - #
  STORE_DIR = File.expand_path('../../public/uploads', __FILE__)

  # - Attributes - #
  attr_accessor :filename, :type, :name, :tempfile, :head

  # - Initializer - #
  def initialize(attributes = {})
    if attributes
      attributes.each_pair do |attribute, value|
        send("#{attribute}=", value)
      end
    end
  end

  # - Instance Methods - #
  def save
    if @tempfile.nil?
      false
    else
      result = true
      set_filename
      begin
        path = File.join(STORE_DIR, @filename)
        File.open(path, 'w') { |f| f.write @tempfile.read }
        AWSUploader.upload @filename, File.open(path)
        File.delete path
      rescue Exception => e
        puts e.message
        result = false
      ensure
        @tempfile.unlink
        @tempfile.close
      end
      result
    end
  end

  def tempfile=(value)
    unless value.is_a? Tempfile or value.nil?
      raise Exception, "Tempfile expected but got #{value.class} instead."
    end
    instance_variable_set :@tempfile, value
  end

  def set_filename
    @filename ||= Time.now.to_i.to_s
  end
end
