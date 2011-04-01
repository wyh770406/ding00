class UserDetail < ActiveRecord::Base
    belongs_to  :user
    
    validates_format_of :mobile, :allow_blank => true, :with => /^((\+86)|(86))?(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/, :message => '请输入正确的手机号码'

    def now_address
      if !self.now_city.empty?
        self.now_city
      elsif !self.now_province.empty?
        self.now_province
      elsif !self.now_country.empty?
        self.now_country
      else
        ''
      end
    end
end
