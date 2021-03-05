import { Button, Checkbox, Col, DatePicker, Form, Input, Radio, Row, TimePicker } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import MultipleSelect from '../components/input/MultipleSelect';
import LocationSearchInput from '../components/restaurant/LocationSearchInput';
import EnumService from '../services/EnumService';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    paddingLeft: 200,
    paddingRight: 200,
    paddingTop: 50,
    paddingBottom: 50,
  },
  formItem: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: '2rem',
    textAlign: 'center',
  },
  radioGroup: {
    display: 'inline-flex',
    justifyContent: 'space-around',
    width: '100%',
  },
};

export default function UploadPromotion(): ReactElement {
  const [form] = Form.useForm();

  const onFinish = () => {
    /* stub */
  };
  const onFinishFailed = () => {
    /* stub */
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { flex: 1 },
  };

  const centerLayout = {
    wrapperCol: { span: 16 },
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
    <div style={styles.container}>
      <h1 style={styles.header}>I want to share a deal!</h1>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        form={form}
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
          style={styles.formItem}
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
          style={styles.formItem}
        >
          <LocationSearchInput onSelect={onSelectRestaurant} onChange={onChangeRestaurant} />
        </Form.Item>

        <Form.Item
          label="Type of Deal"
          name="typeOfDeal"
          labelAlign="left"
          rules={[{ required: true, message: 'Please select a deal type!' }]}
          style={styles.formItem}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Radio.Group defaultValue="none" style={styles.radioGroup}>
            <Radio value="percentageOff">Percentage Off</Radio>
            <Radio value="dollarsOff">Dollars Off</Radio>
            <Radio value="none">N/A</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Cuisine Type"
          name="cuisineType"
          labelAlign="left"
          style={styles.formItem}
        >
          <MultipleSelect
            placeholder="Select a cuisine type"
            options={EnumService.cuisineTypes.map((type) => ({ value: type }))}
          />
        </Form.Item>

        <Form.Item
          label="Category Type"
          name="categoryType"
          labelAlign="left"
          style={styles.formItem}
        >
          <MultipleSelect
            placeholder="Select a category type"
            options={EnumService.promotionTypes.map((type) => ({ value: type }))}
          />
        </Form.Item>

        <Form.Item
          label="Promotion Details"
          name="promotionDetails"
          labelAlign="left"
          style={styles.formItem}
        >
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>

        <Form.Item label="Times" name="promotionTimes" labelAlign="left" style={styles.formItem}>
          <Checkbox.Group style={{ width: '100%' }}>
            {EnumService.daysOfWeek.map((day, index) => (
              <Row key={index} style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Col span={4}>
                  <Checkbox value={day}>{day}</Checkbox>
                </Col>
                <Col>
                  <TimePicker.RangePicker use12Hours minuteStep={15} format="h:mm a" />
                </Col>
              </Row>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Dates Effective:"
          name="datesEffective"
          labelAlign="left"
          style={styles.formItem}
        >
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item {...centerLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
