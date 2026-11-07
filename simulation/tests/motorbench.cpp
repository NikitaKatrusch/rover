#include <cassert>
#include <cstdio>
#include "DriveBench.h"

static void expect(DriveBench& drive, uint32_t time, Drive direction) {
  const DrivePins pins = drive.update(time);
  assert(pins.in1 == (direction == Drive::Forward));
  assert(pins.in2 == (direction == Drive::Reverse));
  assert(pins.pwm == (direction == Drive::Stop ? 0 : 128));
}

int main() {
  DriveBench drive;
  expect(drive, 0, Drive::Stop);
  drive.receive(Drive::Forward, 10);
  expect(drive, 10, Drive::Forward);
  drive.receive(Drive::Reverse, 100);
  expect(drive, 100, Drive::Stop);
  expect(drive, 179, Drive::Stop);
  expect(drive, 180, Drive::Reverse);
  expect(drive, 499, Drive::Reverse);
  expect(drive, 500, Drive::Stop);
  drive.receive(Drive::Forward, 501);
  expect(drive, 501, Drive::Stop);
  expect(drive, 580, Drive::Forward);
  drive.receive(Drive::Stop, 590);
  expect(drive, 590, Drive::Stop);

  DriveBench rollover;
  const uint32_t start = UINT32_MAX - 100;
  rollover.receive(Drive::Forward, start);
  expect(rollover, start + 399, Drive::Forward);
  expect(rollover, start + 400, Drive::Stop);
  std::puts("OK: Start, Richtung, Umkehrpause, Timeout, Stopp und Zeitueberlauf.");
}
