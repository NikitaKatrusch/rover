#pragma once
#include <stdint.h>

enum class Drive : int8_t { Stop, Forward, Reverse };

struct DrivePins {
  bool in1;
  bool in2;
  uint8_t pwm;
};

class DriveBench {
 public:
  static constexpr uint32_t timeoutMs = 400;
  static constexpr uint32_t reversalPauseMs = 80;

  void receive(Drive direction, uint32_t now) {
    requested_ = direction;
    lastCommand_ = now;
  }

  DrivePins update(uint32_t now) {
    if (now - lastCommand_ >= timeoutMs) requested_ = Drive::Stop;
    if (active_ != Drive::Stop && requested_ != active_) {
      lastActive_ = active_;
      active_ = Drive::Stop;
      stoppedAt_ = now;
    }
    const bool reversing = lastActive_ != Drive::Stop && requested_ != lastActive_;
    if (requested_ != Drive::Stop && (!reversing || now - stoppedAt_ >= reversalPauseMs)) {
      active_ = requested_;
      lastActive_ = active_;
    }
    if (active_ == Drive::Forward) return {true, false, 128};
    if (active_ == Drive::Reverse) return {false, true, 128};
    return {false, false, 0};
  }

 private:
  Drive requested_ = Drive::Stop;
  Drive active_ = Drive::Stop;
  Drive lastActive_ = Drive::Stop;
  uint32_t lastCommand_ = 0;
  uint32_t stoppedAt_ = 0;
};
