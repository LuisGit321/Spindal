class AsyncUploader < Sinatra::Base
  register Sinatra::Synchrony

  get '/' do
    haml :index
  end

  post '/' do
    upload = FileUpload.new params[:file]
    case upload.save
    when true
      @success = "File successfully uploaded."
    when false
      @error   = "File could not be uploaded."
    end
    haml :index
  end
end
