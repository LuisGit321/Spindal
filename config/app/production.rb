#encoding: utf-8
App.configure do
  config.s3_access_key_id     = 'AKIAIBVV7BTNR74K2TSQ'
  config.s3_secret_access_key = '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'
  config.s3_bucket            = 'spindal-uploads.dev'
  config.s3_region            = 'us-east-1'

  config.zencoder = {
    api_key: "4fbb0c2f0130f84983593279c5f06f25"
  }

  config.paypal = {
	  login: "band1_1349035251_biz_api1.zoho.com",
	  password: "1349035286",
	  signature: "A5w8ynK64uLddq.TUBeQfHEQ82QKAP4ZrusAEJ6Rbfh7mckwhon-MFoK",
	  setECURL: "https://www.sandbox.paypal.com/incontext"
}
end
