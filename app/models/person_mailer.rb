class PersonMailer < ActionMailer::Base


  def reginfo_check(person)
    from         "审核通过 <wyh770406@gmail.com>"
    recipients   person.EMAIL
    subject      "恭喜您，审核通过"
    body         "person" => person
  end

  def email_verification(ev)
    from         "邮件验证 <wyh770406@gmail.com>"
    recipients   ev.user.email
    subject      "第2步——邮件验证"
    body          "code" => ev.code
  end

  def password_reset(user)
    from         "wyh770406@gmail.com"
    recipients   user.email
    subject      "密码重置"
    body         "user" => user
    content_type "text/html"
  end

  def email_invitation(email,link,attachment)
    from         "邮件验证 <wyh770406@gmail.com>"
    recipients   email
    subject      "通过邮件邀请朋友"
    body          "link" => link,
                   "attachment" => attachment
  end
  def contact_invitation(email,name,attachment)
    from         "邮件验证 <wyh770406@gmail.com>"
    recipients   email
    subject      "邀请IM好友"
    body          "name" => name,
                   "attachment" => attachment
  end


  def event_invitation(email,event)
    from         "wyh770406@gmail.com"
    recipients   email
    subject      "Ding00活动邀请"
    body          "event" => event
    content_type "text/html"
  end

end
