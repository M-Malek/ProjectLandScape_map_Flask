from flask import Flask, render_template, jsonify
from pymongo import MongoClient

app = Flask(__name__)


def func_import_data_from_db():
    # Download and prepare data for map
    client = MongoClient('localhost', 27017)

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


@app.route('/')
def func_main_site_load():
    # Load main site with map
    data = func_import_data_from_db()
    data = data["data"]
    return render_template('index.html', data=data)


if __name__ == "__main__":
    app.run(debug=True)
