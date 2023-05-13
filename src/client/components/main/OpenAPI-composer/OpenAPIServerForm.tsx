import React, { useState, useEffect, Dispatch, SetStateAction} from 'react';
import { useSelector } from 'react-redux';
import ContentReqRowComposer from '../sharedComponents/requestForms/ContentReqRowComposer';
import { $TSFixMe, OpenAPIRequest } from '../../../../types';
import { RootState } from '../../../toolkit-refactor/store';

interface Props {
  newRequestsOpenAPI: OpenAPIRequest;
  openApiRequestsReplaced: (data: OpenAPIRequest) => void;
  setPrimaryServer: React.Dispatch<React.SetStateAction<string>>;
}

const OpenAPIServerForm: React.FC<Props> = ({
  newRequestsOpenAPI,
  openApiRequestsReplaced, 
  setPrimaryServer
}) => {

  // This holds onto state for the ContentReqRowComposer
  const [contentDataArr, setContentDataArr]: $TSFixMe = useState([])
  const [trueIndex, setTrueIndex] = useState(0)

  // populate the contentDataArr upon upload of yml/json openApi file
  useEffect(() => {
    if (newRequestsOpenAPI?.openapiMetadata?.serverUrls) {
      
      const serverUrls: string[] = newRequestsOpenAPI.openapiMetadata.serverUrls
      // 
      // setToggleUrlsArr((oldArr: string[]) => [...oldArr, serverUrls])
      const updatedServers = serverUrls.map((server: string, index: number) => {
        let checked: undefined | boolean
        index == 0 ? checked = true : checked = false
        return {
          id: Math.floor(Math.random() * 1000000),
          active: checked,
          key: `Server ${index + 1}`,
          value: server,
        }
      })
      setContentDataArr(updatedServers || []);
      // setUpdateRef(false)
    }
  }, [newRequestsOpenAPI])


  // Responsible for adding servers to the OpenAPI request
  const addServer = (url: string = '') => {
    
    const newOpenApi = structuredClone(newRequestsOpenAPI);

    if (newOpenApi?.openapiMetadata?.serverUrls) {
      const index = newOpenApi.openapiMetadata.serverUrls.length;
      const str = url
      newOpenApi.openapiMetadata.serverUrls.push({index: str});

      openApiRequestsReplaced({...newOpenApi})
    }
  };

  // Responsible for deleting servers to the OpenAPI request
  const deleteServer = (index: number) => {
    const newOpenApi = structuredClone(newRequestsOpenAPI);

    newOpenApi?.openapiMetadata?.serverUrls.splice(index, 1)

    if (newOpenApi?.openapiMetadata?.serverUrls) {
      openApiRequestsReplaced({...newOpenApi})
    }
  };

  // Responsible for changing/updating the input fields of the servers
  const onChangeUpdateHeader = (
    id: string, 
    field: 'key' | 'value' | 'active', 
    value: boolean | string | number
    ) => {
    
      // make a copy to update the state upon change
    const updatedContentDataArr = [ ...contentDataArr ];
    // intialize an object to tracked checker urls
    // (only one urls should be checked)
    const checkedUrls: $TSFixMe = {}

    // find server to update (update in component state)
    for (let i = 0; i < contentDataArr.length; i += 1) {
      if (contentDataArr[i].id === id) {
        if (updatedContentDataArr[i].active = true) {
          setTrueIndex(i)
        }
        // check or uncheck the box
        if (field === 'active') {
          updatedContentDataArr[i].active = value

          if (updatedContentDataArr[i].active == true) {
            updatedContentDataArr[trueIndex].active = false
            setPrimaryServer(contentDataArr[i].value)
            setTrueIndex(i)
          }
        }
        if (field === 'key') {
          console.log(contentDataArr[i].value)
          updatedContentDataArr[i].key = value
        }
        if (field === 'value') {
          console.log(contentDataArr[i].value)
          updatedContentDataArr[i].value = value
          addServer(updatedContentDataArr[i].value)
        }
        setContentDataArr(updatedContentDataArr)
      }
    }
  };

  const serversArr = contentDataArr.map(
    (server: string, index: number) => {
      return (
        <ContentReqRowComposer
          data={contentDataArr[index]}
          index={index}
          type="header-row"
          changeHandler={onChangeUpdateHeader}
          key={index}
          deleteItem={deleteServer}
        />
      );
    }
  );

  const isDark = useSelector((state: RootState) => state.ui.isDark);

  return (
    <div className="mt-2">
      {JSON.stringify(contentDataArr)}
      {JSON.stringify(newRequestsOpenAPI?.openapiMetadata?.serverUrls)}
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="composer-section-title">Servers</div>
        <button
          onClick={() => addServer()}
          className={`${
            isDark ? 'is-dark-300' : ''
          } button is-small add-header-or-cookie-button`}
        >
          + Server
        </button>
      </div>
      <div>{serversArr && serversArr}</div>
    </div>
  );
};

export default OpenAPIServerForm;
