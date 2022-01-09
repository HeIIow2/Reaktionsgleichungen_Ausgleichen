from selenium import webdriver
import time

from selenium.webdriver.common.keys import Keys

with open('equations.txt', 'r') as equations_file:
    equations_raw = equations_file.read().split('\n')

    equations = []
    blacklist = "()[]"
    for equation in equations_raw:
        add = True
        for blacklisted_item in blacklist:
            if blacklisted_item in equation:
                add = False
                break

        if add:
            equations.append(equation.replace("->", "="))

    print(equations)

def debug(msg: str):
    with open("fails.log", "a") as debug_file:
        debug_file.write(msg)

driver = webdriver.Firefox()
driver.get("https://ln.topdf.de/chemie/")

input_frame = driver.find_element_by_id("reaction-input")

prev_len = 0
for equation in equations:
    for i in range(prev_len):
        input_frame.send_keys(Keys.BACK_SPACE)
    input_frame.send_keys(equation)
    input_frame.send_keys(Keys.ENTER)

    prev_len = len(equation)
    time.sleep(0.5)
    input_frame = driver.find_element_by_id("reaction-input")
    output_frame = driver.find_element_by_id("output")
    print(output_frame.get_attribute('value'))
    if output_frame.get_attribute('value') == "invalid" or output_frame.get_attribute('value') == "":
        debug(equation + '\n')
        time.sleep(4)
    input_frame = driver.find_element_by_id("reaction-input")
    output_frame = driver.find_element_by_id("output")

driver.close()