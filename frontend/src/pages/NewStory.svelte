<script>
  import InputTextArea from '@/components/forms/InputTextArea.svelte';
  import InputText from '@/components/forms/InputText.svelte';
  import { setFormContext } from '@/contexts/form.context';
  import InputSelect from '@/components/forms/InputSelect.svelte';

  const { data } = setFormContext({
    title: '',
    content: '',
    lesson: '',
    tags: [],
    topic: '',
  });

  $: console.log($data);
</script>

<section class="container mx-auto w-3/4 min-w-[300px] text-warm-900/90">
  <h1 class="pt-10 text-center text-2xl">Write a new story</h1>
  <div class="mx-auto mt-5 max-w-[600px]">
    <InputText fieldId="title" placeholder="Title of your story" style="h1" label="Title" />
    <InputTextArea fieldId="content" style="h1" label="Story" info="some info here" />
    <InputSelect
      fieldId="topic"
      style="h1"
      options={[
        { id: '1', text: 'a option 1' },
        { id: '2', text: 'a option 2' },
        { id: '3', text: 'b option 3' },
        { id: '4', text: 'b option 4' },
        { id: '5', text: 'c option 5' },
      ]}
      placeholder="Select a topic"
      label="Topic"
    />
    <InputText fieldId="title" placeholder="Title of your story" style="h1" label="Title" />
  </div>
</section>
