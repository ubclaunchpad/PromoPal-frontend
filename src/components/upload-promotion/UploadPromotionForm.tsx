import './UploadPromotionForm.less';

import { ArrowRightOutlined } from '@ant-design/icons';
import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, TimePicker } from 'antd';
import React, { ReactElement } from 'react';

import EnumService from '../../services/EnumService';
import { abbreviate } from '../../utils/date';
import Button from '../button/Button';
import MultipleSelect from '../input/MultipleSelect';
import LocationSearchInput from '../restaurant/LocationSearchInput';

interface FormFields {
  [field: string]: string;
}

export default function UploadPromotionForm(): ReactElement {
  const [form] = Form.useForm();

  const initialValues: FormFields = {
    cuisineType: '',
    datesEffective: '',
    promotionName: '',
    promotionDetails: '',
    promotionTime: '',
    promotionType: '',
    restaurant: '',
    typeOfDeal: '',
  };

  const onFinish = () => {
    /* stub */
  };
  const onFinishFailed = () => {
    /* stub */
  };

  /**
   * Handler to be called when a restaurant has been selected from the autocomplete options.
   *
   * @param placeId - The placeId of the chosen restaurant
   */
  const onSelectRestaurant = (placeId: string) => {
    form.setFieldsValue({ restaurant: placeId });
  };

  /**
   * Handler to be called when the user types in the text input. The restaurant is set to an empty string,
   * which fails form validation and forces the user to select a restaurant from one of the autocomplete options.
   */
  const onChangeRestaurant = () => {
    form.setFieldsValue({ restaurant: '' });
  };

  return (
    <Form
      className="upload-promotion-form"
      layout="vertical"
      name="basic"
      requiredMark={false}
      labelCol={{ span: 24 }}
      wrapperCol={{ flex: 1 }}
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
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

      <Form.Item
        label="Type of Deal"
        name="typeOfDeal"
        labelAlign="left"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Radio.Group defaultValue="none">
          <Radio value="percentageOff">Percentage Off</Radio>
          <Radio value="dollarsOff">Dollars Off</Radio>
          <Radio value="none">N/A</Radio>
        </Radio.Group>
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
        <MultipleSelect
          allowClear={true}
          placeholder="Select a cuisine type"
          options={EnumService.cuisineTypes.map((type) => ({ value: type }))}
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
        <MultipleSelect
          allowClear={true}
          placeholder="Select a promotion type"
          options={EnumService.promotionTypes.map((type) => ({ value: type }))}
        />
      </Form.Item>

      <Form.Item label="Promotion Details" name="promotionDetails" labelAlign="left">
        <Input.TextArea
          allowClear={true}
          showCount={true}
          maxLength={500}
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Write details about the promotion here..."
        />
      </Form.Item>

      <Form.Item label="Times" name="promotionTimes" labelAlign="left">
        <Checkbox.Group>
          {EnumService.daysOfWeek.map((day, index) => (
            <Row key={index}>
              <Col span={4}>
                <Checkbox value={day}>{abbreviate(day)}</Checkbox>
              </Col>
              <Col>
                <Row gutter={16} align="middle" justify="space-between">
                  <Col>
                    <TimePicker
                      allowClear={true}
                      showNow={false}
                      use12Hours={true}
                      minuteStep={15}
                      format="h:mm a"
                      placeholder="Start time"
                    />
                  </Col>
                  <Col>
                    <ArrowRightOutlined />
                  </Col>
                  <Col>
                    <TimePicker
                      allowClear={true}
                      showNow={false}
                      use12Hours={true}
                      minuteStep={15}
                      format="h:mm a"
                      placeholder="End time"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
        </Checkbox.Group>
      </Form.Item>

      <Form.Item label="Dates Effective" name="datesEffective" labelAlign="left">
        <DatePicker.RangePicker />
      </Form.Item>

      <Form.Item>
        <Row justify="center">
          <Button htmlType="submit" size="large" text="Submit" />
        </Row>
      </Form.Item>
    </Form>
  );
}
