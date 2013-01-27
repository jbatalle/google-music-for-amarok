#!/bin/bash
action=$1
clientLoginUrl="https://www.google.com/accounts/ClientLogin"
service="sj"

function auth() {
	email=$1
	password=$2
   authResponse=$(curl "$clientLoginUrl" --data-urlencode Email="$email" --data-urlencode Passwd="$password" -d accountType=GOOGLE -d service="$service")
   authToken="${authResponse##*=}"
   SID="${authResponse:4:288}"
   LID="${authResponse:298:288}"
   return $SID
}

function listSongs(){
	curl --header "Authorization: GoogleLogin auth=${authToken}"      https://www.googleapis.com/sj/v1beta1/tracks > listSongs.json
}

function getCookie() {
	email=$1
	password=$2
	curl -b cookie.txt -c cookie.txt "https://accounts.google.com/ServiceLogin?service=sj" > file.html
	DSH=$(sed -n -e 's/.*id="dsh" value="\(.*\)".*/\1/p' file.html)
	GALX=$(sed -n -e 's/         value="\(.*\)".*/\1/p' file.html)
	curl -b cookie.txt -c cookie.txt -d "service=sj&dsh=$DSH&GALX=$GALX&pstMsg=1&dnConn=&checkConnection=youtube%3A138%3A1&checkedDomains=youtube&timeStmp=&secTok=&Email=${email}&PersistentCookie=no&Passwd=${password}&signIn=Sign+in" -X POST https://accounts.google.com/ServiceLoginAuth
	rm file.html
}


function getUrlSong(){
	curl -verbose -b cookie.txt -c cookie.txt "https://music.google.com/music/play?u=0&songid=$1&pt=e" > url.json
}
function extractUrl(){
	url=$(cat url.json | sed -e 's/{"url":"/''/g')
	url="${url%?}"
	url="${url%?}"
	echo $url > url
# url=${url//\\\003d/=}
	url=$(sed 's/\\u003d/=/g' url)
	echo $url > url
	url=$(sed 's/\\u0026/\&/g' url)
#  url=${url//\\\0026/&}
#	echo $url > url
rm url
rm url.json
	echo $url
}
getList="getList"
getUrlSong="getUrlSong"
#echo $1>file1.txt
#echo $action>file12.txt
#echo $2>file2.txt
#echo $3>file3.txt
if [ "$action" == "$getList" ]; then
	email=$2
	password=$3
	#echo $1>file232.txt
	auth $email $password
	return_val=$?
#	echo $return_val>return.txt
	if [ "$?" == "" ]; then
		echo "offline"
		echo $return_val>return.txt
	elif [ "$?" != "" ]; then
		listSongs 
		getCookie $email $password 
	fi
elif [ "$action" == "$getUrlSong" ]; then
	songId=$2
	getUrlSong $songId
	extractUrl
#	echo $?
fi