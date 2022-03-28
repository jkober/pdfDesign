<?php


namespace Design\DesignBundle\Services\PdfExterno3;


trait pdfAttach
{
    //inicio attach
    protected function _put($s)
    {
        $this->buffer .= $s."\n";
    }

    protected $files = array();
    protected $n_files;
    protected $open_attachment_pane = false;
    function Attach($file, $name='', $desc='', $isUTF8=false)
    {
        if(!$isUTF8)
            $desc = utf8_encode($desc);
        $this->files[] = array('file'=>$file, 'name'=>$name, 'desc'=>$desc);
    }

    function OpenAttachmentPane()
    {
        $this->open_attachment_pane = true;
    }

    function _putfiles()
    {
        //adaptacion para leer from string
        $s = '';
        foreach($this->files as $i=>$info)
        {
            $file = $info['file'];
            $name = $info['name'];
            $desc = $info['desc'];
            //----------------------------------------------------------------------------------------------------------
            $fc = base64_decode($file);
            unset($info['file']);
            //----------------------------------------------------------------------------------------------------------
            if($fc===false)
                $this->Error('Cannot open file: '.$name);
            //----------------------------------------------------------------------------------------------------------
            //kober $md = @date('YmdHis', filemtime($file));

            $this->_newobj();
            $s .= $this->_textstring(sprintf('%03d',$i)).' '.$this->n.' 0 R ';
            $this->_put('<<');
            $this->_put('/Type /Filespec');
            $this->_put('/F ('.$this->_escape($name).')');
            $this->_put('/UF '.$this->_textstring(utf8_encode($name)));
            $this->_put('/EF <</F '.($this->n+1).' 0 R>>');
            if($desc)
                $this->_put('/Desc '.$this->_textstring($desc));
            $this->_put('>>');
            $this->_put('endobj');

            $this->_newobj();
            $this->_put('<<');
            $this->_put('/Type /EmbeddedFile');
            $this->_put('/Length '.strlen($fc));
            //kober $this->_put("/Params <</ModDate (D:$md)>>");
            $this->_put('>>');
            $this->_putstream($fc);
            $this->_put('endobj');
        }
        $this->_newobj();
        $this->n_files = $this->n;
        $this->_put('<<');
        $this->_put('/Names ['.$s.']');
        $this->_put('>>');
        $this->_put('endobj');
    }

    function _putresources()
    {
        parent::_putresources();
        if(!empty($this->files))
            $this->_putfiles();
    }

    function _putcatalog()
    {
        parent::_putcatalog();
        if(!empty($this->files))
            $this->_put('/Names <</EmbeddedFiles '.$this->n_files.' 0 R>>');
        if($this->open_attachment_pane)
            $this->_put('/PageMode /UseAttachments');
    }
    // fin attach

}