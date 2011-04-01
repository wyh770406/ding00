ActionController::Routing::Routes.draw do |map|
  map.logout '/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/login', :controller => 'sessions', :action => 'new'
  #map.register '/register', :controller => 'users', :action => 'create'
  map.signup '/signup', :controller => 'users', :action => 'new'

  map.resources :users, :collection => { :baseinfo => :get, :avatar => :get, :update_baseinfo => :post, 
    :image_list => :get, :upload_image => :post, :delete_image => :post },:member=>{:reset_password => :post}
  
  map.resource :session

  map.resources :events, :collection => { :get_eventjson => :get }

  map.resources :friends

  map.resources :comments, :collection => { :reply => :get }
  
  map.resources :attentions, :collection => { :mine => :get, :fans => :get, :all => :get, :cancel => :delete, :updatecontrols => :get }

  map.resources :messages, :collection => { :recv => :get, :reply => :get, :sent => :get, 
    :backrecv => :get, :read => :get, :backsent => :get, :empty_recv_box => :get, :empty_sent_box => :get,
    :destroy_all => :get }
  map.resources :password_resets
  map.forgotpass '/forgotpass', :controller => 'password_resets', :action => 'new'
  map.resources :notifications,:member=>{:view_detail=>:post,:ignore_detail=>:post},
    :collection => {:getall => :get,:invitations => :get, :getinvitations => :get, :comments => :get}
  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  map.root :controller => "home"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing or commenting them out if you're using named routes and resources.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
