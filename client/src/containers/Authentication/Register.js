import React, { useMemo, useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';

import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Spinner,
} from '@blueprintjs/core';

import { Row, Col } from 'react-grid-system';
import { Link, useHistory } from 'react-router-dom';
import withAuthenticationActions from './withAuthenticationActions';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import AuthInsider from 'containers/Authentication/AuthInsider';
import { compose } from 'utils';
import Icon from 'components/Icon';
import { If } from 'components';

function Register({ requestRegister }) {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const [shown, setShown] = useState(false);
  const passwordRevealer = useCallback(() => {
    setShown(!shown);
  }, [shown]);

  const ValidationSchema = Yup.object().shape({
    organization_name: Yup.string().required().label(formatMessage({id:'organization_name_'})),
    first_name: Yup.string().required().label(formatMessage({id:'first_name_'})),
    last_name: Yup.string().required().label(formatMessage({id:'last_name_'})),
    email: Yup.string()
      .email()
      .required()
      .label(formatMessage({ id: 'email' })),
    phone_number: Yup.string()
      .matches()
      .required().label(formatMessage({id:'phone_number_'})),
    password: Yup.string()
      .min(4)
      .required().label(formatMessage({id:'password'})),
  });

  const initialValues = useMemo(
    () => ({
      organization_name: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
    }),
    []
  );

  const {
    errors,
    touched,
    values,
    setFieldValue,
    handleSubmit,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
      country: 'libya',
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      requestRegister(values)
        .then((response) => {
          AppToaster.show({
            message: formatMessage({ id: 'success' }),
          });
          setSubmitting(false);
          history.push('/auth/login');
        })
        .catch((errors) => {
          if (errors.some((e) => e.type === 'PHONE_NUMBER_EXISTS')) {
            setErrors({
              phone_number:
                'The phone number is already used in another account.',
            });
          }
          if (errors.some((e) => e.type === 'EMAIL_EXISTS')) {
            setErrors({
              email: 'The email is already used in another account.',
            });
          }
          setSubmitting(false);
        });
    },
  });

  const passwordRevealerTmp = useMemo(
    () => (
      <span class='password-revealer' onClick={() => passwordRevealer()}>
        <If condition={shown}>
          <>
            <Icon icon='eye-slash' />{' '}
            <span class='text'>
              <T id={'hide'} />
            </span>
          </>
        </If>
        <If condition={!shown}>
          <>
            <Icon icon='eye' />{' '}
            <span class='text'>
              <T id={'show'} />
            </span>
          </>
        </If>
      </span>
    ),
    [shown, passwordRevealer]
  );

  return (
    <AuthInsider>
      <div className={'register-form'}>
        <div className={'authentication-page__label-section'}>
          <h3>
            <T id={'register_a_new_organization'} />
          </h3>
          <T id={'you_have_a_bigcapital_account'} />
          <Link to='/auth/login'>
            {' '}
            <T id={'login'} />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className={'authentication-page__form'}>
          <FormGroup
            label={<T id={'organization_name'} />}
            className={'form-group--name'}
            intent={
              errors.organization_name &&
              touched.organization_name &&
              Intent.DANGER
            }
            helperText={
              <ErrorMessage
                {...{ errors, touched }}
                name={'organization_name'}
              />
            }
          >
            <InputGroup
              intent={
                errors.organization_name &&
                touched.organization_name &&
                Intent.DANGER
              }
              {...getFieldProps('organization_name')}
            />
          </FormGroup>

          <Row className={'name-section'}>
            <Col md={6}>
              <FormGroup
                label={<T id={'first_name'} />}
                intent={
                  errors.first_name && touched.first_name && Intent.DANGER
                }
                helperText={
                  <ErrorMessage name={'first_name'} {...{ errors, touched }} />
                }
                className={'form-group--first-name'}
              >
                <InputGroup
                  intent={
                    errors.first_name && touched.first_name && Intent.DANGER
                  }
                  {...getFieldProps('first_name')}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup
                label={<T id={'last_name'} />}
                intent={errors.last_name && touched.last_name && Intent.DANGER}
                helperText={
                  <ErrorMessage name={'last_name'} {...{ errors, touched }} />
                }
                className={'form-group--last-name'}
              >
                <InputGroup
                  intent={
                    errors.last_name && touched.last_name && Intent.DANGER
                  }
                  {...getFieldProps('last_name')}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup
            label={<T id={'phone_number'} />}
            intent={
              errors.phone_number && touched.phone_number && Intent.DANGER
            }
            helperText={
              <ErrorMessage name={'phone_number'} {...{ errors, touched }} />
            }
            className={'form-group--phone-number'}
          >
            <InputGroup
              intent={
                errors.phone_number && touched.phone_number && Intent.DANGER
              }
              {...getFieldProps('phone_number')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'email'} />}
            intent={errors.email && touched.email && Intent.DANGER}
            helperText={
              <ErrorMessage name={'email'} {...{ errors, touched }} />
            }
            className={'form-group--email'}
          >
            <InputGroup
              intent={errors.email && touched.email && Intent.DANGER}
              {...getFieldProps('email')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'password'} />}
            labelInfo={passwordRevealerTmp}
            intent={errors.password && touched.password && Intent.DANGER}
            helperText={
              <ErrorMessage name={'password'} {...{ errors, touched }} />
            }
            className={'form-group--password has-password-revealer'}
          >
            <InputGroup
              lang={true}
              type={shown ? 'text' : 'password'}
              intent={errors.password && touched.password && Intent.DANGER}
              {...getFieldProps('password')}
            />
          </FormGroup>

          <div className={'register-form__agreement-section'}>
          <p>
              <T id={'signing_in_or_creating'} /> <br />
              <Link>
                <T id={'terms_conditions'} />
              </Link>{' '}
              <T id={'and'} />
              <Link>
                {' '}
                <T id={'privacy_statement'} />
              </Link>
            </p>
          </div>

          <div className={'authentication-page__submit-button-wrap'}>
            <Button
              className={'btn-register'}
              intent={Intent.PRIMARY}
              type='submit'
              fill={true}
              loading={isSubmitting}
            >
              <T id={'register'} />
            </Button>
          </div>
        </form>

        <If condition={isSubmitting}>
          <div class='authentication-page__loading-overlay'>
            <Spinner size={50} />
          </div>
        </If>
      </div>
    </AuthInsider>
  );
}

export default compose(withAuthenticationActions)(Register);
