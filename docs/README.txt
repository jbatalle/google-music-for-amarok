SocialRok allows you to post what you're listening in Amarok on the Social Networks, 
allows to send a Cover Arts along with the post and also creates a link to YouTube to do a search!

AVAILABLE NETWORKS
Facebook + Flickr (optional, if you want to send Cover Art along with the post as link format.)
Twitter
GooglePlus (Coming Soon. We have to wait until Google release the API with the write access.)
Skype (curl and python-dbus must be installed.)

INSTRUCTIONS
Take a look at the help in the Script Configuration.

PLEASE READ
I have noticed many failed attempts of sends on facebook, so I decided to add a try/catch on the method to prevent these errors and,
at the same time, I added a return of more descriptive information on errors, so that the user can get an idea of ​​what did not work.
In addition, Facebook has a sending limit for the apps (to prevent spam), so it may happen that after a long series of sends,
facebook blocks the application for the rest of the day. I don't know what is the limit, because it seems to vary based on the received comments/like.
