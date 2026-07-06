import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  EventItem,
  PackedEvent,
  RangeTime,
  TimelineCalendar,
  TimelineCalendarProps,
  UnavailableItemProps,
} from "@howljs/calendar-kit";

import moment from "moment";

import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Button, Dialog, RNToast, Text } from "./index";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAppThemeContext } from "../../hooks/useAppTheme";
import RenderIcon from "./Icon";

export type CalenderCustomProps = {
  eventList?: any;
  newSelectedEvent?: PackedEvent;
  onSelectSlot?: (args?: any) => void;
  onDateChanged: (args: IWeekDayProps) => void;
  hasError?: boolean;
  containerStyles?: ViewStyle;
  keyIndex?: any;
  label?: string;
  required?: boolean;
} & TimelineCalendarProps;

const Calender = ({
  eventList,
  newSelectedEvent,
  onSelectSlot,
  onDateChanged,
  keyIndex,
  label,
  required = false,
  ...restProps
}: CalenderCustomProps) => {
  const { colors } = useAppThemeContext();

  const calendarRef = useRef<any>(null);

  const [visible, setVisible] = useState(false);

  const [events, setEvents] = useState<EventItem[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<PackedEvent>();

  const [unAvailability, setUnAvailability] = useState<Record<string, any>>({});

  const [calendarMonth, setCalendarMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    }),
  );

  const [slotTime, setSlotTime] = useState("");

  const [unavailableSlotSelect, setUnavailableSlotSelect] = useState(false);

  const [toast, showToast] = useState(false);

  const [toastMsg, setToastMsg] = useState("Long press to select slot.");

  const unavailableHours = {
    // '0': [{ start: 0, end: 24 }],
  };

  useEffect(() => {
    setUnAvailability(eventList || {});
  }, [eventList]);

  useEffect(() => {
    setSelectedEvent(newSelectedEvent);
  }, [newSelectedEvent]);

  const onChangeSlot = (eve: any) => {
    const saveEvents = events.map((ev) => {
      if (ev.id === selectedEvent?.id) {
        const newEvent = {
          ...eve,
          end: eve.end,
        };
        const slot =
          moment(eve.start).format("HH:mm") +
          "-" +
          moment(eve.end).format("HH:mm");
        setSlotTime(slot);
        return { ...ev, ...newEvent };
      }
      return ev;
    });

    setEvents(saveEvents);
  };
  const _onDragCreateEnd = (event: RangeTime) => {
    if (
      Number(moment(event.start).format("HH")) < 7 ||
      Number(moment(event.start).format("HH:mm")) > 20
    ) {
      return;
    }
    const check_event = check_user_availability(event);
    if (!check_event) {
      showToast(true);
      setUnavailableSlotSelect(true);
      setToastMsg("Unavailable slot.");
      return;
    }
    setUnavailableSlotSelect(false);
    const randomId = Math.random().toString(36).slice(2, 10);
    const slot =
      moment(event.start).format("HH:mm") +
      "-" +
      moment(event.end).format("HH:mm");
    const newEvent = {
      id: randomId,
      start: event.start,
      title: "Selected Slot",
      end: event.end,
      containerStyle: {
        borderColor: colors.primary,
        borderWidth: 1,
      },
    };
    setSlotTime(slot);
    setEvents([newEvent]);
  };

  const _onLongPressEvent = (event: PackedEvent) => {
    setSelectedEvent(event);
  };

  const _onPressCancel = () => {
    setSelectedEvent(undefined);
    setEvents([]);
  };

  const on_press_unavailable = (dates?: string) => {
    const total_hours: any = { ...unAvailability };

    if (Object.keys(total_hours).includes(moment(dates).format("YYYY-MM-DD"))) {
      const new_date = moment(moment(dates))
        .add(31, "hours")
        .format("YYYY-MM-DD HH:mm");
      // console.log('key_object>>', new_date);
      const key_object = moment(dates).format("YYYY-MM-DD");

      let check_ava = total_hours[key_object].some((i: any) => {
        const eve_start_time = moment(new_date).format("HH.mm").split(".");

        const eve_start =
          parseInt(eve_start_time[0]) +
          parseFloat((parseInt(eve_start_time[1]) / 60).toFixed(2));
        // console.log('eve_start_time', eve_start_time);
        // console.log('eve_start', eve_start);
        // console.log('i_start', i.start);
        // console.log('i_end', i.end);
        if (eve_start >= i.start && eve_start < i.end) {
          return true;
        }
        return false;
      });

      return check_ava;
    }
    return false;
  };

  const check_user_availability = (currentEvent?: any) => {
    const total_hours: any = { ...unAvailability };
    let new_event = currentEvent?.start
      ? [{ ...currentEvent }]
      : selectedEvent?.start
        ? [{ ...selectedEvent }]
        : events;
    if (
      Object.keys(total_hours).includes(
        moment(new_event[0]?.start).format("YYYY-MM-DD"),
      )
    ) {
      const key_object = moment(new_event[0]?.start).format("YYYY-MM-DD");

      let check_ava = total_hours[key_object].some((i: any) => {
        const eve_start_time = moment(new_event[0]?.start)
          .format("HH.mm")
          .split(".");
        const eve_end_time = moment(new_event[0]?.end)
          .format("HH.mm")
          .split(".");
        const eve_start =
          parseInt(eve_start_time[0]) +
          parseFloat((parseInt(eve_start_time[1]) / 60).toFixed(2));
        const eve_end =
          parseInt(eve_end_time[0]) +
          parseFloat((parseInt(eve_end_time[1]) / 60).toFixed(2));
        if (
          (eve_start > i.start && eve_start < i.end) ||
          (eve_end > i.start && eve_end < i.end)
        ) {
          return true;
        }
        return false;
      });
      return !check_ava;
    } else {
      return true;
    }
  };

  const _onPressSubmit = () => {
    const check_availability = check_user_availability();
    const saveEvents = events.map((ev) => {
      if (ev.id === selectedEvent?.id) {
        const newEvent = {
          ...selectedEvent,
          end: selectedEvent.end,
        };
        const slot =
          moment(selectedEvent.start).format("HH:mm") +
          "-" +
          moment(selectedEvent.end).format("HH:mm");
        setSlotTime(slot);
        return { ...ev, ...newEvent };
      }
      return ev;
    });

    setEvents(saveEvents);
    if (onSelectSlot) {
      setSelectedEvent(undefined);
      if (check_availability) {
        onSelectSlot(saveEvents);
        setEvents([]);
        setVisible(false);
      } else {
        setEvents([]);
      }
    }
  };

  const _renderEditFooter = () => {
    return (
      <View style={styles.footer}>
        <View style={{ flexDirection: "row" }}>
          <Button
            label="Cancel"
            onPress={_onPressCancel}
            color={colors.primary}
            style={[styles.cancelBtn, { borderColor: colors.primary }]}
            backgroundColor={colors.background}
          />
          <Button
            label="Save"
            onPress={_onPressSubmit}
            style={{
              marginLeft: 20,
              borderRadius: 4,
            }}
            backgroundColor={colors.primary}
          />
        </View>
      </View>
    );
  };

  const _renderCustomUnavailableItem = useCallback(
    (props: UnavailableItemProps) => {
      return (
        <Pressable
          {...props}
          style={{ backgroundColor: colors.lightGrey, flex: 1, zIndex: 999 }}
          onPress={() => {
            console.log("un available slot");
          }}
        />
      );
    },
    [],
  );

  return (
    <>
      {!!label && (
        <Pressable
          onPress={() => {
            setVisible(true);
            setSlotTime("");
            setUnavailableSlotSelect(false);
            showToast(false);
          }}
        >
          <Text
            style={[
              styles.label,
              {
                color: colors.primary,
              },
            ]}
          >
            {label}

            {required && (
              <Text
                style={{
                  color: colors.error,
                }}
              >
                {" "}
                *
              </Text>
            )}
          </Text>
        </Pressable>
      )}

      <Dialog
        visible={visible}
        onDismiss={() => {
          setVisible(false);
          _onPressCancel();
        }}
        bottom
        snapPoints={["95%"]}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Schedule Calendar</Text>

            <Pressable
              onPress={() => {
                setVisible(false);
                _onPressCancel();
              }}
            >
              <RenderIcon name="X" size={24} color={colors.darkestGrey} />
            </Pressable>
          </View>

          <View
            style={[
              styles.monthView,
              {
                marginBottom: 10,
              },
            ]}
          >
            <Text
              style={[
                styles.unAvailableText,
                {
                  color: colors.text,
                  fontSize: 18,
                },
              ]}
            >
              {calendarMonth}

              {slotTime ? ` (${slotTime})` : ""}
            </Text>
          </View>

          <View
            style={{
              height: events.length ? "80%" : "88%",
            }}
          >
            <TimelineCalendar
              ref={calendarRef}
              key={keyIndex}
              locale="en"
              viewMode="week"
              events={events}
              start={7}
              end={21}
              dragStep={30}
              dragCreateInterval={30}
              scrollToNow={false}
              allowPinchToZoom
              allowDragToCreate
              editEventGestureEnabled
              eventAnimatedDuration={50}
              initialTimeIntervalHeight={100}
              unavailableHours={{
                ...unAvailability,
                ...unavailableHours,
              }}
              renderCustomUnavailableItem={renderUnavailableItem}
              selectedEvent={selectedEvent}
              onEndDragSelectedEvent={(event: any) => {
                setSelectedEvent(event);
                onChangeSlot(event);
              }}
              onLongPressEvent={_onLongPressEvent}
              onDragCreateEnd={_onDragCreateEnd}
              onDateChanged={(date) => {
                const weekEndDate = moment(date)
                  .add(6, "days")
                  .format("YYYY-MM-DD");

                setCalendarMonth(moment(date).format("MMMM"));

                onDateChanged?.({
                  weekStartDate: `${date}+00:00:00`,
                  weekEndDate: `${weekEndDate}+23:59:59`,
                });
              }}
              onPressBackground={(date) => {
                if (onPressUnavailable(date)) {
                  showToast(true);
                  setUnavailableSlotSelect(true);
                  setToastMsg("Unavailable slot.");
                } else {
                  showToast(true);
                  setUnavailableSlotSelect(false);
                  setToastMsg("Long press to select slot.");
                }
              }}
              onPressEvent={() => {
                showToast(true);
                setUnavailableSlotSelect(false);
                setToastMsg("Long press on selected slot to drag.");
              }}
              {...restProps}
            />
            <RNToast
              visible={toast}
              type={unavailableSlotSelect ? "error" : "success"}
              message={toastMsg}
              position="bottom"
              duration={500}
              onDismiss={() => showToast(false)}
            />
          </View>

          {!!events.length && _renderEditFooter()}
        </SafeAreaView>
      </Dialog>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  monthView: {
    alignItems: "center",
  },

  unAvailableCtn: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  unAvailableBox: {
    width: 15,
    height: 15,
    borderRadius: 3,
  },

  unAvailableText: {
    fontWeight: "500",
    marginLeft: 10,
  },

  footer: {
    height: 70,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",

    borderTopWidth: StyleSheet.hairlineWidth,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },

  cancelBtn: {
    borderWidth: 1,
    borderRadius: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
  },

  error: {
    fontSize: 12,
    marginTop: 3,
  },

  button: {
    height: 45,
    paddingHorizontal: 24,
    justifyContent: "center",
    borderRadius: 24,
    marginHorizontal: 8,
    marginVertical: 8,
  },

  btnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Calender;
