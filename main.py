from flask import Flask, render_template, request, url_for, redirect
from pymongo import MongoClient

app = Flask(__name__)


def func_import_data_from_db():
    client = MongoClient('localhost', 27017)

    db = client.PowerPlantsDataBase
    db_request = db.power_plants
    raw_data = list(db_request.find())
    result = []
    for pos in raw_data:
        #print(pos)
        #print(pos['_id'])
        name = pos['powerplant_name']
        _type = pos['powerplant_type']
        owner = pos['powerplant_owner']
        power = pos['powerplant_power']
        lat = pos['powerplant_location']['lat']
        lng = pos['powerplant_location']['lng']
        entry = {'name': name, 'type': _type, 'owner': owner, 'power': power, 'lat': lat, 'lng': lng}
        print(entry)
        result.append(entry)
        entry.clear()

    return result


test = func_import_data_from_db()
print(test)

"""@app.route('/')
def func_main_site_load():
    data = func_import_data_from_db()
    return render_template('index.html', data=data)


if __name__ == "__main__":
    app.run()

"""
