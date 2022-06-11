#!/usr/bin/python3

import json
import sys

def load(f):
    with open(f, 'rb') as data:
        return [ json.loads(line) for line in data ]

def main():
    deaths = load(sys.argv[1])
    alignment = load(sys.argv[2])
    sizes = load(sys.argv[3])

    sizes = { l['map']: (l['width'], l['height']) for l in sizes }

    alignments = { l['map']: (l['overworld'], l['topLeft'], l['size'], l['size'] / sizes[l['map']][0] * sizes[l['map']][1]) for l in alignment }

    for d in deaths:
        m = d['map'] if 'map' in d else 'guide'
        (overworld, tl, width, height) = alignments[m]
        pin = d['pin']
        nx = tl['x'] + pin['x'] * width
        ny = tl['y'] + pin['y'] * height
        rewritten = { 'desc': d['desc'], 'time': d['time'], 'pin': { 'x': nx, 'y': ny }, 'map': overworld}
        print(json.dumps(rewritten))

if __name__ == '__main__':
    main()
