from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)
mongodbHostURL = "localhost"
mongodbHostPort = 27017


def func_import_data_from_db():
    # Download and prepare data for map
    client = MongoClient(mongodbHostURL, mongodbHostPort)

    db = client.PowerPlantsDataBase
    db_request = db.power_plants
    raw_data = list(db_request.find())
    result = {
        "data": []
    }
    for pos in raw_data:
        name = pos['powerplant_name']
        _type = pos['powerplant_type']
        owner = pos['powerplant_owner']
        power = pos['powerplant_power']
        lat = pos['powerplant_location']['lat']
        lng = pos['powerplant_location']['lng']
        entry = {'name': name, 'type': _type, 'owner': owner, 'power': power, 'lat': lat, 'lng': lng}
        result["data"].append(entry)

    return result


@app.route('/data')
def func_api_data_sender():
    # Return data for JS file
    data = func_import_data_from_db()
    # print(data)
    return jsonify(data)


@app.route('/zoom')
def func_api_get_cords_to_zoom():
    name = request.args.get('name', default='none', type=str)
    client = MongoClient(mongodbHostURL, mongodbHostPort)

    db = client.PowerPlantsDataBase
    db_request = db.power_plants
    print(name)
    raw_data = list(db_request.find({"powerplant_name": name}))
    result = {
        "data": []
    }
    for pos in raw_data:
        lat = pos['powerplant_location']['lat']
        lng = pos['powerplant_location']['lng']
        entry = {'lat': lat, 'lng': lng}
        result["data"].append(entry)

    print(result)
    return result


@app.route('/')
def func_main_site_load():
    # Load main site with map
    data = func_import_data_from_db()
    data = data["data"]
    return render_template('index.html', data=data)


if __name__ == "__main__":
    app.run(debug=True)
