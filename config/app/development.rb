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
    login: "band_2_1349298493_biz_1349780334_biz_api1.zoho.com",
    password: "1349780357",
    signature: "AYha-BlY.fNyldCM6ZXL.3nTLU9oA5vlihSFeJlCF33AS3G512LH9P4Y",
    setECURL: "https://www.sandbox.paypal.com/incontext"
  }

end
