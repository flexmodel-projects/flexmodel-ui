interface Props {
  datasource: string;
  model: any;
}

const ModelGroupView = ({model}: Props) => {
  return <>
    <p>
      Model count: {model?.children?.length}
    </p>
  </>;
};

export default ModelGroupView;
