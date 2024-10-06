JSON_PAYLOAD="{\"log\":{\"event_name\":\"login\"}}"
for (( i = 0; i < 11000; i++ ))
do
      curl -s 'http://localhost:3000/log' \
            -H 'Content-Type: application/json' \
            -d "$JSON_PAYLOAD" &
      echo "$i req"
done

wait

echo "done"