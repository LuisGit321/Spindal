require 'minitest_helper'
require './lib/aws_uploader'

describe AWSUploader do
  before do
    ENV['S3_ACCESS_KEY_ID']     ||= '1234'
    ENV['S3_SECRET_ACCESS_KEY'] ||= '1234'
  end

  describe "files upload" do
    it "raises an error when the 'file' argument is not a File" do
      [:foo, 'bar', 123, false].each do |o|
        proc { AWSUploader.upload 'foo.txt', o }.must_raise ArgumentError
      end
    end

    it "returns an aws file when the upload is successfull" do
      Fog.mock!
      _file = File.open File.expand_path('./test/support/file.txt')
      file = AWSUploader.upload '', _file
      file.must_be_instance_of Fog::Storage::AWS::File
    end
  end

  describe "#bucket" do
    it "returns a AWS directory" do
      Fog.mock!
      AWSUploader.bucket.must_be_instance_of Fog::Storage::AWS::Directory
    end
  end

  describe "#connection" do
    it "returns a connection object" do
      Fog.mock!
      AWSUploader.connection.must_be_instance_of Fog::Storage::AWS::Mock
    end

    it "returns an exception when no credentials are setup" do
      ENV['S3_ACCESS_KEY_ID']     = nil
      ENV['S3_SECRET_ACCESS_KEY'] = nil
      AWSUploader.stub :credentials, nil do
        proc { AWSUploader.connection }.must_raise Exception
      end
    end
  end
end
