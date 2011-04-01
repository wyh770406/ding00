class UserDetails < ActiveRecord::Migration
    def self.up
        create_table (:user_details, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
            t.column        :user_id,       :integer
            t.column        :now_country,    :string ,    :null => false   ,:limit=>10  ,:default=>""
            t.column        :now_province,   :string,    :null => false   ,:limit=>20  ,:default=>""
            t.column        :now_city,   :string,    :null => false   ,:limit=>20  ,:default=>""
            t.timestamps
        end
        add_index :user_details, :user_id
        execute "alter table user_details add constraint FK_user_to_user_detail " +
            "foreign key (user_id) references users(id)"
    end

    def self.down
        drop_table :user_details
    end
end
