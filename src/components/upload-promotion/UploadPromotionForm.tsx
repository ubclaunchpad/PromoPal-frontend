import './UploadPromotionForm.less';

import { DatePicker, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';

import EnumService from '../../services/EnumService';
import * as PromotionService from '../../services/PromotionService';
import UserService from '../../services/UserService';
import { Day, PostPromotionDTO, Schedule } from '../../types/promotion';
import Button from '../button/Button';
import LocationSearchInput from '../restaurant/LocationSearchInput';
import PromotionTime from './PromotionTime';

interface FormFields {
  cuisineType: string;
  datesEffective: string[];
  discountType: string;
  discountValue: number;
  promotionName: string;
  promotionDescription: string;
  promotionTimes: moment.Moment[];
  promotionType: string;
  restaurant: string;
  restaurantAddress: string;
}

interface PromotionTimes {
  [day: string]: {
    start: moment.Moment;
    end: moment.Moment;
    isRecurring: boolean;
  };
}

interface PromotionDates {
  start: string;
  end: string;
}

// TODO: handle errors in POST /promotion
// https://promopal.atlassian.net/browse/PP-87
export default function UploadPromotionForm(): ReactElement {
  const [form] = Form.useForm();

  const history = useHistory();

  const [datesEffective, setDatesEffective] = useState<PromotionDates>({ start: '', end: '' });
  const [times, setTimes] = useState<PromotionTimes>({});

  const initialValues: FormFields = {
    cuisineType: '',
    datesEffective: [],
    discountType: '',
    discountValue: NaN,
    promotionName: '',
    promotionDescription: '',
    promotionTimes: [],
    promotionType: '',
    restaurant: '',
    restaurantAddress: '',
  };

  /**
   * Handler to be called when form is submitted. This function processes and cleans the values from the form
   * by creating a promotionDTO object and making the post request to the BE.
   *
   * @param values - The values entered in the form
   */
  const onFinish = (values: unknown): void => {
    const getSchedules = (): Schedule[] => {
      return Object.entries(times).map(([day, times]) => {
        return {
          dayOfWeek: day as Day,
          startTime: get24HourTime(times.start),
          endTime: get24HourTime(times.end),
          // TODO: calculate isRecurring
          isRecurring: times.isRecurring,
        };
      });
    };

    const get24HourTime = (day: moment.Moment): string => {
      let formattedHours = '';
      const hours = day.hours();
      if (hours < 10) {
        formattedHours += '0';
      }
      formattedHours += hours;

      let formattedMinutes = '';
      const minutes = day.minutes();
      if (minutes < 10) {
        formattedMinutes += '0';
      }
      formattedMinutes += minutes;

      return `${formattedHours}:${formattedMinutes}`;
    };

    const formValues = values as FormFields;
    const promotionDTO: PostPromotionDTO = {
      cuisine: formValues.cuisineType,
      description: formValues.promotionDescription,
      discount: {
        discountType: formValues.discountType,
        discountValue: formValues.discountValue,
      },
      expirationDate: formValues.datesEffective[1],
      name: formValues.promotionName,
      placeId: formValues.restaurant,
      promotionType: formValues.promotionType,
      address: formValues.restaurantAddress,
      schedules: getSchedules(),
      startDate: formValues.datesEffective[0],
      userId: UserService.userId,
    };

    PromotionService.postPromotion(promotionDTO)
      .then(() => {
        history.push('/promotions');

        const successMessage = `The promotion "${formValues.promotionName}" was successfully uploaded!`;
        message.success(successMessage, 5);
      })
      .catch((error) => {
        let errorMessage = 'An error occurred. ';
        if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
          errorMessage = errorMessage + error.response.data.message.join('. ');
        }
        message.error(errorMessage, 5);
      });
  };

  /**
   * Handler to be called when a date is selected for when the promotion starts/ends.
   *
   * @param dates - The moment objects for the start/end dates
   * @param dateStrings - The strings for the start/end dates
   * @param info - Specifies whether the start/end date was changed
   */
  const onDatesSelected = (
    _: unknown,
    dateStrings: string[],
    { range }: { range: 'start' | 'end' }
  ): void => {
    const [start, end] = dateStrings;
    const updatedDates = datesEffective;
    if (range === 'start') {
      updatedDates.start = start;
    } else {
      updatedDates.end = end;
    }
    setDatesEffective(updatedDates);
  };

  /**
   * Handler to be called when a promotion day has been selected. This either initializes the day in the times object
   * if the checkbox is checked, or deletes the day from the times object if the checkbox is unchecked.
   *
   * @param event - The checkbox change event
   */
  const onDaySelected = ({ target: { checked, value } }: CheckboxChangeEvent): void => {
    // Update map of days to times
    const updatedTimes = { ...times };
    if (checked) {
      if (!updatedTimes[value]) {
        updatedTimes[value] = { start: moment(), end: moment(), isRecurring: false };
      }
    } else {
      delete updatedTimes[value];
    }
    setTimes(updatedTimes);

    // Set form field with selected day
    const promotionTimes = form.getFieldValue('promotionTimes');
    promotionTimes.push(value);
    form.setFieldsValue({ promotionTimes });
  };

  /**
   * Handler to be alled when the cuisine type is selected.
   *
   * @param cuisineType - The selected cuisine type
   */
  const onSelectCuisineType = (cuisineType: string[]): void => {
    form.setFieldsValue({ cuisineType });
  };

  /**
   * Handler to be called when the promotion type is selected.
   *
   * @param promotionType - The selected promotion type
   */
  const onSelectPromotionType = (promotionType: string[]): void => {
    form.setFieldsValue({ promotionType });
  };

  /**
   * Handler to be called when a promotion time has been changed. This sets either the start or end time on the
   * given day in the times object held in the component state.
   *
   * @param type - Specifies whether the given time is a start time or end time
   * @param day - The day which this time corresponds to
   * @param time - The moment object reprsenting the time selected
   */
  const onTimeChange = (type: 'start' | 'end', day: string, time: unknown): void => {
    const momentObject = time as moment.Moment;
    if (day in times) {
      const updatedTimes = { ...times };
      updatedTimes[day][type] = momentObject;
      setTimes(updatedTimes);
    }
  };

  /**
   * Handler to be called when a restaurant has been selected from the autocomplete options.
   *
   * @param placeId - The placeId of the chosen restaurant
   * @param restaurantAddress - The address of the chosen restaurant
   */
  const onSelectRestaurant = (placeId: string, restaurantAddress: string): void => {
    form.setFieldsValue({ restaurant: placeId, restaurantAddress });
  };

  /**
   * Handler to be called when the user types in the text input. The restaurant and address are set to empty strings,
   * which fails form validation and forces the user to select a restaurant from one of the autocomplete options.
   */
  const onChangeRestaurant = (): void => {
    form.setFieldsValue({ restaurant: '', restaurantAddress: '' });
  };

  /**
   * Handler to be called when the discount value is changed.
   *
   * @param discountValue - The discount Value
   */
  function onDiscountValueChange(discountValue: number): void {
    form.setFieldsValue({ discountValue });
  }

  /**
   * Handler to be called when the discount type is selected.
   *
   * @param discountType - The selected discount type
   */
  const onDiscountTypeChange = (discountType: string[]): void => {
    form.setFieldsValue({ discountType });
  };

  return (
    <Form
      className="upload-promotion-form"
      layout="vertical"
      requiredMark={false}
      scrollToFirstError={true}
      labelCol={{ span: 24 }}
      wrapperCol={{ flex: 1 }}
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        label="Promotion Name"
        name="promotionName"
        labelAlign="left"
        rules={[
          {
            required: true,
            message: 'Please input a name for the promotion!',
          },
        ]}
      >
        <Input placeholder="e.g. 10% off Happy Hour Menu" autoComplete="off" allowClear={true} />
      </Form.Item>

      <Form.Item
        label="Restaurant"
        name="restaurant"
        labelAlign="left"
        rules={[
          {
            required: true,
            message: 'Please select a restaurant! Search for one by name or address.',
          },
        ]}
      >
        <LocationSearchInput onSelect={onSelectRestaurant} onChange={onChangeRestaurant} />
      </Form.Item>

      <Form.Item name="restaurantAddress" hidden={true} />

      <Form.Item
        label="Discount"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Input.Group compact>
          <Form.Item
            name="discountValue"
            rules={[
              {
                required: true,
                message: 'Please input a discount value!',
              },
            ]}
          >
            <InputNumber onChange={onDiscountValueChange} />
          </Form.Item>
          <Form.Item
            name="discountType"
            rules={[
              {
                required: true,
                message: 'Please select a discount type!',
              },
            ]}
            style={{ marginLeft: '3px' }}
          >
            <Select
              options={EnumService.discountTypes.map((type) => ({ value: type }))}
              onChange={onDiscountTypeChange}
            ></Select>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item
        label="Cuisine Type"
        name="cuisineType"
        labelAlign="left"
        rules={[
          {
            required: true,
            message: 'Please select a cuisine type!',
          },
        ]}
      >
        <Select
          allowClear={true}
          placeholder="Select a cuisine type"
          options={EnumService.cuisineTypes.map((type) => ({ value: type }))}
          onChange={onSelectCuisineType}
        />
      </Form.Item>

      <Form.Item
        label="Promotion Type"
        name="promotionType"
        labelAlign="left"
        rules={[
          {
            required: true,
            message: 'Please select a promotion type!',
          },
        ]}
      >
        <Select
          allowClear={true}
          placeholder="Select a promotion type"
          options={EnumService.promotionTypes.map((type) => ({ value: type }))}
          onChange={onSelectPromotionType}
        />
      </Form.Item>

      <Form.Item
        label="Promotion Details"
        name="promotionDescription"
        labelAlign="left"
        rules={[
          {
            required: true,
            message: 'Please add a description!',
          },
        ]}
      >
        <Input.TextArea
          allowClear={true}
          showCount={true}
          maxLength={500}
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Write details about the promotion here..."
        />
      </Form.Item>

      <Form.Item
        label="Times"
        name="promotionTimes"
        labelAlign="left"
        rules={[
          {
            required: true,
            message: 'Please select the times when the promotion is valid!',
          },
        ]}
      >
        <PromotionTime onDaySelected={onDaySelected} onTimeChange={onTimeChange} />
      </Form.Item>

      <Form.Item
        label="Dates Effective"
        name="datesEffective"
        labelAlign="left"
        rules={[
          {
            required: true,
            message: 'Please select the dates when the promotion is valid!',
          },
        ]}
      >
        <DatePicker.RangePicker allowEmpty={[true, false]} onCalendarChange={onDatesSelected} />
      </Form.Item>

      <Form.Item>
        <Row justify="center" className="submit-upload-promotion-form">
          <Button htmlType="submit" size="large" text="Submit" />
        </Row>
      </Form.Item>
    </Form>
  );
}
