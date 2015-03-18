require 'minitest_helper'
require 'tempfile'
require './models/file_upload'

describe FileUpload do
  it "allows to create a new instance assigning attributes on the constructor" do
    upload = FileUpload.new(
      filename: 'some-filename.txt',
      name:     'file',
      type:     'text/plain',
      head:     'Content-Disposition: form-data; name=\"file\"; filename=\"IMG_4187.JPG\"\r\nContent-Type: image/jpeg\r\n',
      tempfile: Tempfile.new('')
    )
    [:filename, :type, :name, :tempfile, :head].each do |attribute|
      upload.send(attribute).wont_be_nil
    end
  end

  it "allows to create a new instance given a nil argument for the constructor" do
    upload = FileUpload.new
    upload.wont_be_nil
  end

  describe "#save" do
    before do
      ENV['S3_ACCESS_KEY_ID']     ||= '1234'
      ENV['S3_SECRET_ACCESS_KEY'] ||= '1234'
      Fog.mock!
    end

    after do
      FileUtils.rm_rf(Dir.glob("#{FileUpload::STORE_DIR}/*"))
    end

    it "returns false if there is no tempfile" do
      upload = FileUpload.new tempfile: nil
      upload.save.must_equal false
    end

    it "deletes the new file under the uploads directory after uploading it using AWSUploader" do
      upload = FileUpload.new(
        tempfile: get_tempfile,
        filename: 'awesome-file.txt'
      )
      upload.save
      path = File.join FileUpload::STORE_DIR, upload.filename
      File.exists?(path).must_equal false
    end

    it "creates a new file under the uploads directory" do
      File.stub :delete, nil do
        upload = FileUpload.new(
          tempfile: get_tempfile,
          filename: 'awesome-file.txt'
        )
        expected_count = Dir.entries(FileUpload::STORE_DIR).count + 1
        upload.save
        Dir.entries(FileUpload::STORE_DIR).count.must_equal expected_count
        path = File.join FileUpload::STORE_DIR, upload.filename
        File.exists?(path).must_equal true
      end
    end

    it "creates a new file with his own file name" do
      File.stub :delete, nil do
        upload = FileUpload.new(
          tempfile: get_tempfile,
          filename: 'awesome-file.txt'
        )
        upload.save
        Dir.entries(FileUpload::STORE_DIR).must_include upload.filename
      end
    end

    it "assigns a random file name when no file name is given" do
      upload = FileUpload.new tempfile: get_tempfile
      upload.save
      upload.filename.wont_be_nil
    end

    it "returns true when a copy of the tempfile is saved" do
      upload = FileUpload.new(
        tempfile: get_tempfile,
        name:     'awesome-file.txt'
      )
      upload.save.must_equal true
    end
  end

  describe "#tempfile=" do
    it 'complains when the given value is not a Tempfile' do
      proc { FileUpload.new tempfile: '' }.must_raise Exception
      upload = FileUpload.new
      proc { upload.tempfile = '' }.must_raise Exception
    end
  end

end

def get_tempfile
  text_file = File.open File.expand_path('../../support/file.txt', __FILE__)
  file      = Tempfile.new ''
  file.path
  file.write text_file.read
  file.rewind
  file
end
