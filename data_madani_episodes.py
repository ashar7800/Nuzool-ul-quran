# -*- coding: utf-8 -*-
"""
Madani Era Episodes Combiner (Episodes 36 to 80)
"""
from data_madani_part1 import register_madani_part1
from data_madani_part2 import register_madani_part2

def register_madani_episodes(add_ep):
    register_madani_part1(add_ep)
    register_madani_part2(add_ep)

print("Madani episodes combiner ready.")
