class AWSUploader
  class << self

    def upload(name, file)
      unless file.is_a? File
        raise ArgumentError, "File expected but got #{file.class}"
      end
      bucket.files.create key: name, body: file
    end

    def bucket
      @bucket = connection.directories.create(key: bucket_name, public: true)
    end

    def connection
      raise Exception, 'No AWS credentials found.' if credentials.nil?
      @connection ||= Fog::Storage.new credentials
    end

    protected

      def credentials
        access_key = ENV['S3_ACCESS_KEY_ID']
        secret_key = ENV['S3_SECRET_ACCESS_KEY']
        if access_key.nil? and secret_key.nil?
          nil
        else
          @credentials ||= {
            provider:              'AWS',
            aws_access_key_id:     access_key,
            aws_secret_access_key: secret_key
          }
        end
      end

      def bucket_name
        @bucket_name ||= ENV['S3_BUCKET'] or 'uploads'
      end
  end
end
